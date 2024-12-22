import React, { useState, useEffect } from 'react';
import { Button, Text, TextInput, View, StyleSheet, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword, onAuthStateChanged, getAuth } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebaseAuth';

export default function LoginScreen({ navigation }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const authInstance = getAuth();
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      if (user) navigation.navigate('Dashboard');
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const authInstance = getAuth();
      const userCredential = await signInWithEmailAndPassword(authInstance, form.email, form.password);

      const userDoc = await getDoc(doc(db, 'alert', userCredential.user.uid));
      if (userDoc.exists() && userDoc.data().role === 'user') {
        navigation.navigate('Dashboard');
      } else {
        setError('Unauthorized access.');
      }
    } catch (err) {
      setError(translateErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const translateErrorMessage = (code) => {
    const messages = {
      'auth/user-not-found': 'No user found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-email': 'Invalid email address.',
    };
    return messages[code] || 'An error occurred. Please try again.';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={(text) => handleInputChange('email', text)}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        onChangeText={(text) => handleInputChange('password', text)}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {loading ? <ActivityIndicator size="large" color="#0000ff" /> : <Button title="Login" onPress={handleLogin} />}
      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>Create an account? Register here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 30, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '80%', borderWidth: 1, borderColor: '#000', borderRadius: 5, padding: 10, marginVertical: 10 },
  error: { color: 'red', marginTop: 10 },
  link: { color: 'blue', textDecorationLine: 'underline', marginTop: 20 },
});

import React, { useState,useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet,ActivityIndicator } from 'react-native';
import { getAuth, signInWithEmailAndPassword,onAuthStateChanged } from 'firebase/auth';
import { getFirestore, getDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const auth = getAuth();
const db = getFirestore();

export default function AdminLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
      const authInstance = getAuth();
      const unsubscribe = onAuthStateChanged(authInstance, (user) => {
        if (user) navigation.navigate('AdminDashboard');
      });
      return () => unsubscribe();
    }, []);


  const handleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'admins', user.uid));

      if (userDoc.exists()) {
        const userRole = userDoc.data().role;
        
        if (userRole === 'admin') {
          // Redirect to Admin Dashboard
          navigation.navigate('AdminDashboard');
        } else {
          alert('You are not an admin');
        }
      } else {
        setError('User not found in Firestore');
      }
    } catch (error) {
      alert('You are not an admin');
      navigation.navigate('Startup');
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />
      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading ? <ActivityIndicator size="large" color="#0000ff" /> : <Button title="Login" onPress={handleLogin} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
});

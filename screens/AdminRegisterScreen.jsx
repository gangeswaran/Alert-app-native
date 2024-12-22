import React, { useEffect, useState } from 'react';
import { Button, Text, TextInput, View, StyleSheet, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../services/firebaseAuth';
import { doc, setDoc } from 'firebase/firestore';
export default function AdminRegisterScreen({ navigation }) {
  const [form, setForm] = useState({ email: '', password: '', department: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

 
  

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdminRegister = async () => {
    try {
      setError('');
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      if (user) {
        await setDoc(doc(db, 'admins', user.uid), {
          email: user.email,
          uid: user.uid,
          role: 'admin',
        });
        navigation.navigate('AdminDashboard'); // Navigate to the admin dashboard
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Register</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={(text) => handleInputChange('email', text)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        onChangeText={(text) => handleInputChange('password', text)}
      /> 
      {loading ? <ActivityIndicator size="large" color="#0000ff" /> : <Button title="Register" onPress={handleAdminRegister} />}
      {error && <Text style={styles.error}>{error}</Text>}
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Already have an account? Login</Text>
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

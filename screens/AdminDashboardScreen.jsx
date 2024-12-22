import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Button, Text, View, StyleSheet, FlatList, TextInput } from 'react-native';
import { collection, query, getDocs, addDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebaseAuth';

export default function AdminDashboardScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchUserData();
    fetchNotifications();
  }, []);

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      setUserData(user);
    } else {
      console.log('No user found');
    }
  };

  const fetchNotifications = async () => {
    const q = query(collection(db, 'notifications'));
    const snapshot = await getDocs(q);
    const fetchedNotifications = snapshot.docs.map(doc => doc.data());
    setNotifications(fetchedNotifications);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.log('Error during sign out: ', error);
    }
  };

  const sendNotification = async () => {
    if (!message || !location) {
      alert('Please enter a message and location');
      return;
    }

    try {
      await addDoc(collection(db, 'notifications'), {
        message,
        location,
        timestamp: new Date(),
      });
      setMessage('');
      setLocation('');
      fetchNotifications();
    } catch (error) {
      console.log('Error sending notification: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.subTitle}>Send Alert Notifications</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Enter message"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <Button title="Send Notification" onPress={sendNotification} />

      <Text style={styles.subTitle}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <View style={styles.notification}>
            <Text style={styles.alertText}>Location: {item.location}</Text>
            <Text style={styles.alertText}>Message: {item.message}</Text>
            <Text style={styles.alertText}>
              Sent At: {item.timestamp.toDate().toLocaleString()}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  alertText: {
    fontSize: 15,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
  notification: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
});

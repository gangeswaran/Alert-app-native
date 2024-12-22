import React, { useState, useEffect } from 'react';
import { Animated, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native'; // Importing Lottie for animations
import { getAuth,onAuthStateChanged } from 'firebase/auth';

export default function StartupScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));  // Initial value for opacity: 0
  const navigation = useNavigation();

  // Animate fade-in on component mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

  }, [fadeAnim]);


  const handleUserLogin = () => {
    navigation.navigate('Login');
  };

  const handleAdminLogin = () => {
    navigation.navigate('AdminLogin');
    // console.log('adminDashboard');
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LottieView
        source={require('../assets/animate.json')} // Add your own Lottie animation file here
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.title}>Welcome to MyApp</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleUserLogin}>
          <Text style={styles.buttonText}>User Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleAdminLogin}>
          <Text style={styles.buttonText}>Admin Login</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  buttonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3b71ca',
    padding: 15,
    marginBottom: 20,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

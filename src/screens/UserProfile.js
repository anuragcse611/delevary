import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import { getUserProfile, changePassword, logoutUser } from '../utils/api'; // Add logoutUser to your API functions
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfile = ({ navigation }) => {
  const [profile, setProfile] = useState({});
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      Alert.alert('Error', 'Failed to fetch user profile');
    }
  };

  const handleChangePassword = async () => {
    if (oldPassword === '' || newPassword === '') {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      Alert.alert('Success', 'Password changed successfully');
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to change password');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser(); // Implement this function in your API
      await AsyncStorage.removeItem('userToken'); // Clear the user token
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginButtons' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <View style={styles.profileInfo}>
        <Text style={styles.infoText}>Name: {profile.name}</Text>
        <Text style={styles.infoText}>Email: {profile.email}</Text>
        <Text style={styles.infoText}>Role: {profile.role}</Text>
      </View>

      <View style={styles.passwordSection}>
        <Text style={styles.sectionTitle}>Change Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Old Password"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <Button title="Change Password" onPress={handleChangePassword} />
      </View>

      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileInfo: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  passwordSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default UserProfile;
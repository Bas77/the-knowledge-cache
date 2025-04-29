import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { useRouter } from 'expo-router';

const ProfilePage = () => {
  const router = useRouter();

  // Placeholder data (simulate what you'll fetch from backend)
  const user = {
    username: 'Lapis',
    email: 'dominikus.ramli@binus.ac.id',
    avatar: 'https://i.pinimg.com/736x/01/b3/87/01b3879be4e77405e4ec69b16e0b0304.jpg', // Placeholder image
    joinedDate: 'May 2025',
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.joined}>Joined {user.joinedDate}</Text>
      </View>

      {/* Profile Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionCard} onPress={() => {/* e.g. router.push('/edit-profile') */}}>
          <Ionicons name="create-outline" size={24} color={COLORS.primary} />
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => {/* router.push('/settings') */}}>
          <Ionicons name="settings-outline" size={24} color={COLORS.primary} />
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionCard, { borderColor: '#FF5C5C' }]} onPress={()=> router.push('/(auth)/login')} >
          <Ionicons name="log-out-outline" size={24} color="#FF5C5C" />
          <Text style={[styles.actionText, { color: '#FF5C5C' }]}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* App Info / Placeholder */}
      <Text style={styles.sectionTitle}>App Info</Text>
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>Version 1.0.0</Text>
        <Text style={styles.infoText}>Developed by Group 1</Text>
        <Text style={styles.infoText}>Archi Setio - Scrum Master</Text>
        <Text style={styles.infoText}>Dominikus Sebastian Ramli - Lead Developer</Text>
        <Text style={styles.infoText}>I Made Ananda Ryan Viryavan - Product Owner</Text>
        <Text style={styles.infoText}>Vincent Virgo - Design Team</Text>
        <Text style={styles.infoText}>Vincent Tanaka - Design Team</Text>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    color: '#FFF',
    fontWeight: '600',
  },
  email: {
    color: '#AAA',
    fontSize: 14,
    marginTop: 4,
  },
  joined: {
    color: '#555',
    fontSize: 12,
    marginTop: 4,
  },
  actionsContainer: {
    marginBottom: 30,
  },
  actionCard: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 12,
    color: '#FFF',
    fontSize: 16,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 16,
  },
  infoText: {
    color: '#AAA',
    fontSize: 14,
    marginBottom: 4,
  },
});

export default ProfilePage;

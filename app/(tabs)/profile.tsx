import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const ProfilePage = () => {
  const router = useRouter();
  const { user, setGlobalUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null)

  
  type Profile = {
    name: string;
    profile_picture: string | null;
    created_at: string;
    formatted_date?: string;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('name, profile_picture, created_at')
        .eq('id', user?.id)
        .single();
  
      if (error) throw error;
      if (!data) return;
      const storagePath = data.profile_picture.includes('profile-pictures/')
        ? data.profile_picture.split('profile-pictures/')[1]
        : data.profile_picture;
      // Set initial state
      const profileData: Profile = {
        name: data.name,
        profile_picture: null, // Default to null
        created_at: data.created_at,
        formatted_date: formatDate(data.created_at),
      };
  
      // Only try to get URL if path exists
      if (storagePath) {
        const pictureUrl = await getProfilePicture(storagePath);
        profileData.profile_picture = pictureUrl;
      }
  
      setProfile(profileData);
  
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    }
  };
  
  const getProfilePicture = async (filePath: string): Promise<string | null> => {
    try {
      // 1. First check if file exists
      const { data: fileList } = await supabase.storage
        .from('profile-pictures')
        .list('', {
          search: filePath
        });
  
      if (!fileList || fileList.length === 0) {
        console.log('File not found:', filePath);
        return null;
      }
  
      // 2. Get signed URL if file exists
      const { data, error } = await supabase.storage
        .from('profile-pictures')
        .createSignedUrl(filePath, 3600); // 1 hour expiration
  
      if (error) throw error;
      return data?.signedUrl || null;
  
    } catch (error) {
      console.error('Error getting signed URL:', error);
      return null;
    }
  };

  const handleLogout = async () => {
    try {
      // 1. Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // 2. Clear local user state
      setGlobalUser(null);
      
      // 3. Navigate to login screen
      router.replace('/(auth)/login');
      
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Logout Failed', error.message);
        console.error('Logout error:', error.message);
      } else {
        Alert.alert('Logout Failed', 'An unknown error occurred');
        console.error('Unknown logout error:', error);
      }
    }
  }
  useEffect(() => {

    getProfile();
    console.log(profile?.profile_picture);
  }, []);
  
  return (
    <ScrollView 
      style={styles.container} 
      overScrollMode="always"
      // showsVerticalScrollIndicator={true}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
      {profile?.profile_picture ? (
        <Image
        source={{ uri: profile.profile_picture }}
        style={styles.avatar}
        defaultSource={require('@/assets/images/icon.png')}
        />
      ) : (
        <Image
        source={require('@/assets/images/icon.png')}
        style={styles.avatar}
        />
        )}
        <Text style={styles.name}>{profile?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.joined}>Joined {profile?.formatted_date}</Text>
      </View>

      {/* Profile Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionCard} onPress={() => {/* e.g. router.push('/edit-profile') */}}>
          <Ionicons name="create-outline" size={24} color={COLORS.primary} />
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>
    {/* 
        <TouchableOpacity style={styles.actionCard} onPress={() => {/* router.push('/settings') }}>
          <Ionicons name="settings-outline" size={24} color={COLORS.primary} />
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity> 
        
    */}

        <TouchableOpacity style={[styles.actionCard, { borderColor: '#FF5C5C' }]} onPress={handleLogout} >
          <Ionicons name="log-out-outline" size={24} color="#FF5C5C" />
          <Text style={[styles.actionText, { color: '#FF5C5C' }]}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* App Info / Placeholder */}
      <Text style={styles.sectionTitle}>App Info</Text>
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>The Knowledge Cache</Text>
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
    zIndex: 2
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

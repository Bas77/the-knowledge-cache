import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { useRouter } from 'expo-router';

const HomePage = () => {
  // Sample data for recent sets and statistics
  const recentSets = [
    { id: '1', title: 'Software Engineering', progress: 65 },
    { id: '2', title: 'Big Data Processing', progress: 42 },
  ];

  const stats = {
    streak: 5,
    totalCards: 143,
    mastered: 87,
  };

  const router = useRouter();
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back!</Text>
        <View style={styles.streakContainer}>
          <Ionicons name="flame" size={24} color={COLORS.primary} />
          <Text style={styles.streakText}>{stats.streak} day streak</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push('/(tabs)/flashcard')}
        >
          <Ionicons name="add-circle" size={32} color={COLORS.primary} />
          <Text style={styles.actionText}>New Set</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push('/(tabs)/learna')}
        >
          <Ionicons name="book" size={32} color={COLORS.primary} />
          <Text style={styles.actionText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Sets */}
      <Text style={styles.sectionTitle}>Recent Sets</Text>
      {recentSets.map((set) => (
        <TouchableOpacity 
          key={set.id} 
          style={styles.setCard}
          onPress={() => router.push('/(tabs)/flashcard' /*, { setId: set.id }*/)}
        >
          <View style={styles.setInfo}>
            <Text style={styles.setTitle}>{set.title}</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${set.progress}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{set.progress}% mastered</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#FFF" />
        </TouchableOpacity>
      ))}

      {/* Statistics */}
      <Text style={styles.sectionTitle}>Your Progress</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalCards}</Text>
          <Text style={styles.statLabel}>Total Cards</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.mastered}</Text>
          <Text style={styles.statLabel}>Mastered</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {Math.round((stats.mastered / stats.totalCards) * 100)}%
          </Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>
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
  header: {
    marginBottom: 30,
  },
  greeting: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    color: COLORS.primary,
    fontSize: 16,
    marginLeft: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionCard: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 15,
    width: '48%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#FFF',
    marginTop: 10,
    fontSize: 16,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  setCard: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  setInfo: {
    flex: 1,
  },
  setTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    marginBottom: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressText: {
    color: '#AAA',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    width: '32%',
    padding: 15,
    alignItems: 'center',
  },
  statNumber: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    color: '#AAA',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default HomePage;
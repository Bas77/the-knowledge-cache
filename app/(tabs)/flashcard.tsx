import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define types for our flashcard set
type FlashcardSet = {
  id: string;
  title: string;
  count: number;
};

const Flashcard = () => {
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([
    { id: '1', title: 'Biology Terms', count: 42 },
    { id: '2', title: 'French Vocabulary', count: 36 },
    { id: '3', title: 'History Dates', count: 28 },
    { id: '4', title: 'Math Formulas', count: 15 },
    { id: '5', title: 'Programming Concepts', count: 31 },
  ]);

  const [selectedSet, setSelectedSet] = useState<string | null>(null);

  // Properly type the renderItem function
  const renderItem = ({ item }: { item: FlashcardSet }) => (
    <TouchableOpacity
      style={[
        styles.setItem,
        selectedSet === item.id && styles.selectedSetItem
      ]}
      onPress={() => setSelectedSet(item.id)}
    >
      <View style={styles.setInfo}>
        <Text style={styles.setTitle}>{item.title}</Text>
        <Text style={styles.setCount}>{item.count} cards</Text>
      </View>
      {selectedSet === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Flashcard Set</Text>
      
      <FlatList
        data={flashcardSets}
        renderItem={renderItem}
        keyExtractor={(item: FlashcardSet) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity 
        style={[
          styles.confirmButton,
          !selectedSet && styles.confirmButtonDisabled
        ]}
        disabled={!selectedSet}
      >
        <Text style={styles.confirmButtonText}>
          {selectedSet ? 'Start Studying' : 'Select a Set'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      padding: 20,
    },
    header: {
      color: '#FFF',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    listContainer: {
      paddingBottom: 20,
    },
    setItem: {
      backgroundColor: '#1E1E1E',
      borderWidth: 1,
      borderColor: '#FFF',
      borderRadius: 10,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    selectedSetItem: {
      borderColor: '#4CAF50',
      borderWidth: 2,
    },
    setInfo: {
      flex: 1,
    },
    setTitle: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 4,
    },
    setCount: {
      color: '#AAA',
      fontSize: 14,
    },
    confirmButton: {
      backgroundColor: '#4CAF50',
      padding: 16,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 10,
    },
    confirmButtonDisabled: {
      backgroundColor: '#333',
    },
    confirmButtonText: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

export default Flashcard;
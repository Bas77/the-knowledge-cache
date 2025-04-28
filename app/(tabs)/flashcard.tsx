import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {styles} from '@/styles/flashcard.styles'
// Define types for our flashcard set
type FlashcardSet = {
  id: string;
  title: string;
  count: number;
};

const Flashcard = () => {
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([
    { id: '1', title: 'Software Engineering', count: 42 },
    { id: '2', title: 'Big Data Processing', count: 36 },
    { id: '3', title: 'Database Design', count: 28 },
    { id: '4', title: 'Research Methodology', count: 15 },
    { id: '5', title: 'Data Analytics', count: 31 },
  ]);

  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [setToDelete, setSetToDelete] = useState<string | null>(null);
  const confirmDelete = (setId: string) => {
    setSetToDelete(setId);
    setDeleteModalVisible(true);
  };

  const handleDelete = () => {
    // Your actual delete logic here
    Alert.alert('Success', 'Flashcard set deleted');
    setDeleteModalVisible(false);
  };
  
  // Properly type the renderItem function
  const renderItem = ({ item }: { item: FlashcardSet }) => (
    <TouchableOpacity
      style={[
        styles.setItem,
        selectedSet === item.id && styles.selectedSetItem
      ]}
      onPress={() => selectedSet !==item.id ? setSelectedSet(item.id): setSelectedSet(null)}
    >
      <View style={styles.setInfo}>
        <Text style={styles.setTitle}>{item.title}</Text>
        <Text style={styles.setCount}>{item.count} cards</Text>
      </View>
      {selectedSet === item.id &&
      (<View style={styles.setItemButtonContainer}>
        <TouchableOpacity style={styles.setItemButtonEdit}><Text style={styles.setItemButtonText}>Edit</Text></TouchableOpacity>
        <TouchableOpacity style={styles.setItemButtonTest}><Text style={styles.setItemButtonText}>Test</Text></TouchableOpacity>
        <TouchableOpacity><Ionicons name="trash" style={styles.deleteButton} size={32} onPress={() => confirmDelete(item.id)} /></TouchableOpacity>
      </View>)}
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
        ListFooterComponent={
          <TouchableOpacity 
            style={styles.confirmButton}
          >
            <Text style={styles.confirmButtonText}>
              Create New Set
            </Text>
          </TouchableOpacity>
        }
      />

      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Set</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete this flashcard set? This action cannot be undone.
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={handleDelete}
              >
                <Text style={styles.deleteConfirmText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Flashcard;
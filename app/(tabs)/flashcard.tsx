import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {styles} from '@/styles/flashcard.styles'
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { COLORS } from '@/constants/theme';
import { router } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';

type FlashcardCount = { count: number };

type FlashcardSet = {
  id: string;
  title: string;
  card_count: number;
  flashcards: FlashcardCount[];
};

type UserRepoRow = {
  set_id: string;
  sets: FlashcardSet;
};

const Flashcard = () => {
  const [sets, setSets] = useState<any[]>([]);
  const {user, setGlobalUser} = useAuth();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      // console.log('is focused');
      fetchSets();
    }
  }, [isFocused]);

  const fetchSets = async () => {
    try {
      // 1. First get all set_ids for this user
      const { data: userRepos, error: repoError } = await supabase
        .from('user_repository')
        .select('set_id')
        .eq('user_id', user?.id);
  
      if (repoError) throw repoError;
      if (!userRepos?.length) {
        setSets([]);
        return;
      }
  
      // 2. Get all sets with counts using the set_ids
      const setIds = userRepos.map(repo => repo.set_id);
      const { data: setsData, error: setsError } = await supabase
        .from('sets')
        .select(`
          id,
          title,
          owner_id,
          flashcards(count)
        `)
        .in('id', setIds);
  
      if (setsError) throw setsError;
  
      // Transform the data
      const setsWithCounts = (setsData || []).map(set => ({
        ...set,
        card_count: set.flashcards?.[0]?.count || 0
      }));
  
      setSets(setsWithCounts);
      
    } catch (err) {
      console.error('Error fetching sets:', err);
      setSets([]);
    }
  };
  // const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([
  //   { id: '1', title: 'Software Engineering', count: 42 },
  //   { id: '2', title: 'Big Data Processing', count: 36 },
  //   { id: '3', title: 'Database Design', count: 28 },
  //   { id: '4', title: 'Research Methodology', count: 15 },
  //   { id: '5', title: 'Data Analytics', count: 31 },
  // ]);

  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [setToDelete, setSetToDelete] = useState<string | null>(null);
  const confirmDelete = (setId: string) => {
    setSetToDelete(setId);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    console.log(setToDelete);
    const previousData = [sets];
        const { data, error } = await supabase
            .from('user_repository')
            .delete()
            .eq('set_id', setToDelete)
    
            if (error) {
              setSets(previousData);
              console.error('Failed to delete:', error);
            } else {
              setSets(sets.filter(item => item.id !== setToDelete))
              console.log('Deleted:', data);
            }
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
        <Text style={styles.setCount}>{item.card_count} cards</Text>
      </View>
      {selectedSet === item.id &&
      (<View style={styles.setItemButtonContainer}>
        <TouchableOpacity><Ionicons name="trash" style={styles.deleteButton} size={32} onPress={() => confirmDelete(item.id)} /></TouchableOpacity>
        <TouchableOpacity style={styles.setItemButtonEdit}><Text style={styles.setItemButtonText}>Edit</Text></TouchableOpacity>
        <TouchableOpacity style={styles.setItemButtonTest} onPress={() => router.push('../(flashcard)/review')}><Text style={styles.setItemButtonText} >Review</Text></TouchableOpacity>
      </View>)}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Select Flashcard Set</Text>
        <TouchableOpacity 
        style={styles.searchButton}
        onPress={() => router.push('../(flashcard)/search')}
        >
          <Ionicons name="search" size={32}  color={COLORS.primary}/>
        </TouchableOpacity>
      </View>
      <FlatList
        data={sets}
        renderItem={renderItem}
        keyExtractor={(item: FlashcardSet) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-sharp" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No sets in repository!</Text>
          </View>
        }
        ListFooterComponent={
          <TouchableOpacity style={styles.createButton} onPress={() => router.push('../(flashcard)/create')}>
            <Text style={styles.createButtonText}>＋</Text>
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
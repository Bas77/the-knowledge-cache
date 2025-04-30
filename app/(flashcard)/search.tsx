import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {styles} from '@/styles/(flashcard)/search.styles'
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { COLORS } from '@/constants/theme';
import { router } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';

// Define types for our flashcard set
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
        console.log('is focused: ' + user?.id);
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
      console.log('userRepos:', userRepos);
      if (repoError) throw repoError;
      if (!userRepos?.length) {
        fetchAllSets();
        return;
      }
  
      // 2. Get all sets with counts using the set_ids
      const setIds = userRepos.map(repo => repo.set_id);
      console.log('Current user sets:' + setIds);

      const { data: setsData, error: setsError } = await supabase
        .from('sets')
        .select(`
          id,
          title,
          owner_id,
          flashcards(count)
        `)
        .eq('is_public', true)
        .not('id', 'in', `(${setIds.join(',')})`);
  
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

  const fetchAllSets = async () => {
    const { data: setsData, error: setsError } = await supabase
        .from('sets')
        .select(`
          id,
          title,
          owner_id,
          flashcards(count)
        `)
        .eq('is_public', true)

    if (setsError) throw setsError;
  
      // Transform the data
    const setsWithCounts = (setsData || []).map(set => ({
      ...set,
      card_count: set.flashcards?.[0]?.count || 0
    }));
    
    setSets(setsWithCounts); 
  }
 
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [setToDelete, setSetToDelete] = useState<string | null>(null);
  const confirmDelete = (setId: string) => {
    setSetToDelete(setId);
    setDeleteModalVisible(true);
  };

  const addFlashcard = async (setId: string) => {
    console.log(setId);
    const { data, error } = await supabase
        .from('user_repository')
        .insert([{
          user_id : user?.id,
          set_id : setId,
        }])

        if (error) {
          console.error('Failed to insert:', error);
        } else {
          fetchSets();
          console.log('Inserted:', data);
        }
  }

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
        <Text style={styles.setCount}>{item.card_count} cards</Text>
      </View>
      {selectedSet === item.id &&
      (<View style={styles.setItemButtonContainer}>
        <TouchableOpacity style={styles.setItemButtonEdit} onPress={() => addFlashcard(selectedSet)}><Text style={styles.setItemButtonText}>Add</Text></TouchableOpacity>
        {/* <TouchableOpacity><Ionicons name="trash" style={styles.deleteButton} size={32} onPress={() => confirmDelete(item.id)} /></TouchableOpacity> */}
      </View>)}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
        style={styles.searchButton}
        onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={32}  color={COLORS.primary}/>
        </TouchableOpacity>
        <Text style={styles.header}>Search Flashcard Set</Text>
        
      </View>
      <FlatList
        data={sets}
        renderItem={renderItem}
        keyExtractor={(item: FlashcardSet) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default Flashcard;
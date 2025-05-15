import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/styles/flashcard.styles'
import { supabase } from '../../lib/supabase';
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


const Flashcard = () => {
  const [sets, setSets] = useState<any[]>([]);
  const {user, setGlobalUser} = useAuth();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (isFocused) {
      // console.log('is focused');
      fetchSets();
    }
  }, [isFocused]);

  const fetchSets = async () => {
    try {
      // 1. First get all set_ids for this user
      setIsLoading(true);
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
    } finally{
      setIsLoading(false);
    }
  };


  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [setToDelete, setSetToDelete] = useState<string | null>(null);
  const [ownerDeleteModalVisible, setOwnerDeleteModalVisible] = useState(false);

  const confirmDelete = async (setId: string) => {
    setSetToDelete(setId);
    // setDeleteModalVisible(true);
    console.log('setId: ', setId);
    const {data, error} = await supabase
      .from('sets')
      .select('owner_id')
      .eq('id', setId)
      .single()

    console.log('data: ', data);
    if(error) throw(error);
    if (data?.owner_id === user?.id) {
      setOwnerDeleteModalVisible(true); // Show owner-specific modal
    } else {
      setDeleteModalVisible(true); // Show regular delete modal
    }
  };

  const handleDelete = async (deleteForEveryone: boolean = false) => {
    console.log('Set to delete: ' ,setToDelete)
    if (!setToDelete) {
      Alert.alert('Error deleting set!');
      return;
    }
    // console.log(setToDelete);
    try {
      // First remove from user_repository
      const { error: repoError } = await supabase
        .from('user_repository')
        .delete()
        .eq('set_id', setToDelete)
        .eq('user_id', user?.id);

      if (repoError) throw repoError;

      // If owner and chose to delete for everyone
      if (deleteForEveryone) {
        // Delete the set itself
        await supabase
          .from('sets')
          .delete()
          .eq('id', setToDelete);
      }

      // Update local state
      setSets(sets.filter(item => item.id !== setToDelete));
    } catch (error) {
      console.error('Failed to delete:', error);
      Alert.alert('Error', 'Failed to delete the set');
    } finally {
      setDeleteModalVisible(false);
      setOwnerDeleteModalVisible(false);
      setSetToDelete(null);
    }
  };
  
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
        <TouchableOpacity style={styles.setItemButtonEdit} onPress={() => router.push({
          pathname: '../(flashcard)/edit',
          params: {setId: selectedSet, setTitle: item.title}
        })}>
        <Text style={styles.setItemButtonText}>Edit</Text></TouchableOpacity>
        <TouchableOpacity style={styles.setItemButtonTest} onPress={() => router.push({
          pathname: '../(flashcard)/review',
          params: {setId: selectedSet }
        })}>
        <Text style={styles.setItemButtonText} >Review</Text></TouchableOpacity>
      </View>)}
      
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
}
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
      />

      <TouchableOpacity style={styles.createButton} onPress={() => router.push('../(flashcard)/createSet')}>
          <Text style={styles.createButtonText}>＋</Text>
      </TouchableOpacity>

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
              Are you sure you want to delete this flashcard set from your repository?
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
                onPress={() => handleDelete(false)}
              >
                <Text style={styles.deleteConfirmText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={ownerDeleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setOwnerDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Set</Text>
            <Text style={styles.modalMessage}>
              You're the owner of this set. Delete it just for yourself or for all users?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setOwnerDeleteModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteForMeButton]}
                onPress={() => handleDelete(false)}
              >
                <Text style={styles.deleteConfirmText}>Just For Me</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteForAllButton]}
                onPress={() => handleDelete(true)}
              >
                <Text style={styles.deleteConfirmText}>For Everyone</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Flashcard;
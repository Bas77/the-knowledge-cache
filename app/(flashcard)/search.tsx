import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {styles} from '@/styles/(flashcard)/search.styles'
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { COLORS } from '@/constants/theme';
import { router } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';


const Flashcard = () => {
  const [sets, setSets] = useState<any[]>([]);
  const {user, setGlobalUser} = useAuth();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      if (isFocused) {
        console.log('is focused: ' + user?.id);
        fetchSets();
      }
    }, [isFocused]);
  const fetchSets = async () => {
    try {
      setIsLoading(true);
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
          users:owner_id(name),
          description,
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
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllSets = async () => {
    const { data: setsData, error: setsError } = await supabase
        .from('sets')
        .select(`
          id,
          title,
          users:owner_id(name),
          description,
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
    setIsLoading(false);
  }
 
  if (isLoading) {
      return (
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }
    
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
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discover Sets</Text>
        <View style={{ width: 28 }} /> 
      </View>

        <FlatList
          data={sets}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardCount}>{item.card_count} cards</Text>
              </View>
              
              {item.description && (
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              )}

              <View style={styles.cardFooter}>
                <Text style={styles.creatorText}>By {item.users?.name}</Text>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => addFlashcard(item.id)}
                >
                  <Text style={styles.addButtonText}>Add to Collection</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={48} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>No public sets available</Text>
            </View>
          }
        />
    </View>
  );
};

export default Flashcard;
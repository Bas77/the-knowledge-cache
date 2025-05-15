import { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function CreateSetScreen() {
  const [setsName, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const {user, setGlobalUser} = useAuth();

  const insertRepo = async (setId: string) => {
    const { data, error } = await supabase
        .from('user_repository')
        .insert([{ 
          user_id: user?.id, 
          set_id: setId
        }])
        .select()
        .single();
      if(error) throw error;
  }
  const handleCreateSet = async () => {
    if (!setsName.trim()) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('sets')
        .insert([{ 
          title: setsName, 
          owner_id: user?.id,
          description: description,
          is_public: isPublic 
        }])
        .select()
        .single();

      if (error) throw error;
      insertRepo(data.id);

      router.replace({
        pathname:`/(flashcard)/edit`, 
        params: {setId: data.id}
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Set</Text>
        <TouchableOpacity 
          onPress={handleCreateSet}
          disabled={!setsName.trim() || isSubmitting}
        >
          <Text style={[styles.headerAction, 
            (!setsName.trim() || isSubmitting) && styles.disabled
          ]}>
            {isSubmitting ? 'Creating...' : 'Create'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.titleInput}
          placeholder="Set title"
          placeholderTextColor={COLORS.textSecondary}
          value={setsName}
          onChangeText={setName}
          autoFocus
        />
        
        <TextInput
          style={styles.descriptionInput}
          placeholder="Description (optional)"
          placeholderTextColor={COLORS.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
        />

    <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={() => setIsPublic(!isPublic)} style={styles.checkbox}>
        {isPublic ? (
      <Ionicons name="checkbox" size={24} color={COLORS.primary} />
        ) : (
      <Ionicons name="square-outline" size={24} color={COLORS.textSecondary} />
        )}
        <Text style={styles.checkboxLabel}>Make this set public</Text>
    </TouchableOpacity>
</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  headerAction: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
  form: {
    gap: 16,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    padding: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
  },
  descriptionInput: {
    fontSize: 16,
    color: COLORS.text,
    padding: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxLabel: {
    color: COLORS.text,
    fontSize: 16,
  },
});
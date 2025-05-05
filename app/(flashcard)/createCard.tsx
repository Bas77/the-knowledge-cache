import { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams, router } from 'expo-router';

export default function CreateCardScreen() {
  const { id: setId } = useLocalSearchParams();
  const [card, setCard] = useState({
    question: '',
    answer: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateCard = async () => {
    if (!card.question.trim() || !card.answer.trim()) return;

    setIsSubmitting(true);
    try {
      // await supabase
      //   .from('flashcards')
      //   .insert([{ 
      //     question: card.question,
      //     answer: card.answer,
      //     set_id: setId 
      //   }]);

      // Clear inputs for next card
      setCard({ question: '', answer: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Cards</Text>
        <TouchableOpacity onPress={() => router.push(`/sets/${setId}`)}>
          <Text style={styles.headerAction}>Done</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Question"
            placeholderTextColor={COLORS.textSecondary}
            value={card.question}
            onChangeText={(text) => setCard({...card, question: text})}
            multiline
            autoFocus
          />
        </View>

        <View style={[styles.card, { backgroundColor: COLORS.surfaceLight }]}>
          <TextInput
            style={styles.input}
            placeholder="Answer"
            placeholderTextColor={COLORS.textSecondary}
            value={card.answer}
            onChangeText={(text) => setCard({...card, answer: text})}
            multiline
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.addButton, 
          (!card.question.trim() || !card.answer.trim()) && styles.disabled
        ]}
        onPress={handleCreateCard}
        disabled={!card.question.trim() || !card.answer.trim() || isSubmitting}
      >
        <Ionicons 
          name={isSubmitting ? "hourglass" : "add"} 
          size={24} 
          color="white" 
        />
        <Text style={styles.addButtonText}>
          {isSubmitting ? 'Adding...' : 'Add Card'}
        </Text>
      </TouchableOpacity>
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
  cardContainer: {
    flex: 1,
    gap: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    minHeight: 150,
  },
  input: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    textAlignVertical: 'top',
    flex: 1,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
});
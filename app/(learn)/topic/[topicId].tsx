import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styles } from '@/styles/learn.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

const TopicList = () => {
  const { topicTitle, topicExplanation } = useLocalSearchParams();
  const router = useRouter();

  const currentTopicTitle = topicTitle.length > 0 ? topicTitle: 'Topics';
  const textToDisplay = Array.isArray(topicExplanation)
    ? topicExplanation.join(' ') 
    : topicExplanation;
  
    const formattedText = textToDisplay.replace(/\\n/g, '\n');

  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
      <TouchableOpacity 
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
      </TouchableOpacity>
      <Text style={styles.header}>{currentTopicTitle}</Text>
      <View style={styles.spacer} />
    </View>
      <Text style={styles.explanationText}>{formattedText}</Text>
    </View>
    
  );
};

export default TopicList;

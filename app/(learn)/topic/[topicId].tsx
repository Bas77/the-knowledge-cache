import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styles } from '@/styles/learn.styles';

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
      <Text style={styles.header}>{currentTopicTitle}</Text>
      <Text style={styles.explanationText}>{formattedText}</Text>
    </View>
    
  );
};

export default TopicList;

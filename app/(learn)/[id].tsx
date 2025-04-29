import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styles } from '@/styles/learn.styles';
import { supabase } from '@/lib/supabase';


  const TopicList = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [topics, setTopics] = useState<any[]>([]);
  
    useEffect(() => {
      const fetchTopics = async () => {
        const { data, error } = await supabase
          .from('topics')
          .select('*')
          .eq('subject_id', id);
  
        if (error) console.error(error);
        else setTopics(data);
        // console.log(data);
      };
  
      fetchTopics();
    }, [id]);

    
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Topics</Text>
      <FlatList
        data={topics}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.topicItem}
            onPress={() =>
              router.push({
                pathname: `/(learn)/topic/${item.id}`,
                params: { topicExplanation: item.explanation, topicTitle: item.title },
              })
            }
          >
            <Text style={styles.topicTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default TopicList;

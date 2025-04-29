import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '@/styles/learn.styles';
import { supabase } from '@/lib/supabase';
// const topic = [
//   { id: '1', title: 'Software Engineering' },
//   { id: '2', title: 'Big Data Processing' },
//   { id: '3', title: 'Database Design' },
//   { id: '4', title: 'Research Methodology' },
//   { id: '5', title: 'Data Analytics' },
// ];



const LearnHome = () => {
  const router = useRouter();
  const [subjects, setSubjects] = useState<any[]>([]);
    
      useEffect(() => {
        const fetchTopics = async () => {
          const { data, error } = await supabase
            .from('subjects')
            .select('*')
    
          if (error) console.error(error);
          else setSubjects(data);
          console.log(data);
          // console.log(data);
        };
    
        fetchTopics();
      },[]);
  return (
    <View style={styles.container}>
      <Text style={styles.header2}>Learn by Subject</Text>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.topicItem}
            onPress={() => router.push({
              pathname: `/(learn)/${item.id}`,
              params: {topicExplanation: item.explanation, topicTitle: item.title}
            })}
          >
            <Text style={styles.topicTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default LearnHome;

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, Pressable, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { styles } from '@/styles/(flashcard)/review.styles';
import { supabase } from '@/lib/supabase';
// import {changeNavigationBarColor} from 'react-native-navigation-bar-color';
const { width } = Dimensions.get('window');

// const flashcards = [
//   { question: 'What is normalization in DB?', answer: 'It\'s the process of organizing data to reduce redundancy.' },
//   { question: 'Define ACID in DB.', answer: 'Atomicity, Consistency, Isolation, Durability.' },
//   { question: 'What is a foreign key?', answer: 'A key used to link two tables together.' },
// ];

type Flashcard = {
  id: string;
  author_id: string;
  front: string;
  back: string;
  set_id: string;
};

const ReviewPage = () => {
  const {setId} = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
        const fetchCards = async () => {
          try{
          setIsLoading(true);
          const { data, error } = await supabase
            .from('flashcards')
            .select('*')
            .eq('set_id', setId as string);
          console.log('flashcards gottem: ' , data);
          if (error) {
            console.error(error);
            throw(error);
          }
          if(data)
          setFlashcards(data);
          // console.log(data);
        } catch(error) {throw(error)}
        finally{
          setIsLoading(false);
        }
        };
        fetchCards();
      }, [setId]);
  // Flip animation
  const flipCard = () => {
    Animated.spring(flipAnimation, {
      toValue: flipped ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start(() => setFlipped(!flipped));
  };

  const animateSlide = (direction: 'left' | 'right') => {
    // Reset flip state
    setFlipped(false);
    flipAnimation.setValue(0);
    
    // Set initial slide position
    slideAnimation.setValue(direction === 'left' ? width : -width);
    
    // Animate slide in
    Animated.spring(slideAnimation, {
      toValue: 0,
      friction: 10,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      animateSlide('left');
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      animateSlide('right');
      setCurrentIndex(currentIndex - 1);
    }
  };
  const lastTap = useRef<number | null>(null);

  const handlePress = (evt:any) => {
    
    console.log(`x coord = ${evt.nativeEvent.locationX}, y coord = ${evt.nativeEvent.locationY}`);
    if(width/2 < evt.nativeEvent.locationX){
        console.log('right');
        handleNext();
    } else {
        console.log('left');
        handlePrev();
    }

  }

  const handleSinglePress = () => {
    const now = Date.now();
    if (lastTap.current && (now - lastTap.current) < 300) {
    flipCard(); // double tap detected
    } else {
        lastTap.current = now;
    }
  }
  const currentCard = flashcards[currentIndex];

  // Flip animations
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [
      { rotateY: frontInterpolate },
      { translateX: slideAnimation },
    ],
    opacity: flipAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0, 0]
    })
  };

  const backAnimatedStyle = {
    transform: [
      { rotateY: backInterpolate },
      { translateX: slideAnimation },
    ],
    opacity: flipAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1]
    })
  };
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
  
  if (flashcards.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>No flashcards found in this set</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.replace('(tabs)/flashcard')}
        >
          <Text style={styles.backText}>Back to Sets</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <Pressable style={styles.container} onLongPress={handlePress} onPress={handleSinglePress}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Review Flashcards</Text>
        <TouchableOpacity 
          style={styles.helpButton}
          onPress={() => setShowHelpModal(true)}
        >
          <Ionicons name="help-circle" size={32} color={COLORS.primary} />
        </TouchableOpacity>
      </View>


      <TouchableOpacity
        activeOpacity={1}
        style={styles.cardContainer}
        onPress={flipCard}
      >
        <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
          <Text style={styles.cardTitle}>Question</Text>
          <Text style={styles.cardText}>{currentCard.front}</Text>
          <Text style={styles.tapHint}>Tap to flip</Text>
        </Animated.View>

        <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
          <Text style={styles.cardTitle}>Answer</Text>
          <Text style={styles.cardText}>{currentCard.back}</Text>
          <Text style={styles.tapHint}>Tap to flip</Text>
        </Animated.View>
      </TouchableOpacity>

      <Text style={styles.progressText}>
        {currentIndex + 1} / {flashcards.length}
      </Text>

      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.disabled]}
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <Ionicons name="arrow-back" size={28} color={currentIndex === 0 ? 'grey' : 'black'} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
          <Ionicons name="repeat" size={28} color={COLORS.primary} />
          <Text style={styles.flipText}>Flip Card</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, currentIndex === flashcards.length - 1 && styles.disabled]}
          onPress={handleNext}
          disabled={currentIndex === flashcards.length - 1}
        >
          <Ionicons name="arrow-forward" size={28} color={currentIndex === flashcards.length - 1 ? 'grey' : 'black'} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('(tabs)/flashcard')}>
        <Text style={styles.backText}>Back to Sets</Text>
      </TouchableOpacity>
      <Modal
        visible={showHelpModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowHelpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Flashcard Gestures</Text>
            
            <View style={styles.helpItem}>
              <Ionicons name="repeat" size={24} color={COLORS.primary} />
              <Text style={styles.helpText}>Double tap anywhere to flip the card</Text>
            </View>
            
            <View style={styles.helpItem}>
              <Ionicons name="arrow-redo" size={24} color={COLORS.primary} />
              <Text style={styles.helpText}>Long press left side to go back</Text>
            </View>
            
            <View style={styles.helpItem}>
              <Ionicons name="arrow-undo" size={24} color={COLORS.primary} />
              <Text style={styles.helpText}>Long press right side to go forward</Text>
            </View>

            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowHelpModal(false)}
            >
              <Text style={styles.modalCloseText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Pressable>
  );
};

export default ReviewPage;
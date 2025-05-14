import { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native"
import { COLORS } from "@/constants/theme"
import { router } from "expo-router"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"

interface Flashcard {
  id: string
  front: string
  back: string
//   set_id: string
  author_id: string | undefined
}


export default function EditFlashcardSet() {
  const route = useRoute()
  const { setId, setTitle } = route.params as { setId: string, setTitle: string }
  const [isLoading, setIsLoading] = useState(false);
  const {user, setGlobalUser} = useAuth();
  const [Flashcards, setFlashcards] = useState<Flashcard[] | null>(null)
  const [originalFlashcardIds, setOriginalFlashcardIds] = useState<string[]>([])
  const isFocused = useIsFocused();
  
    
    useEffect(() => {
        if (isFocused) {
        //   console.log('is focused: ' + user?.id);
          fetchCards();
        }
    }, [isFocused]);

    const fetchCards = async () => {
        try{
            setIsLoading(true)
            const {data} = await supabase
            .from('flashcards')
            .select(`
                front,
                back,
                id,
                author_id
            `)
            .eq('set_id', setId)
            console.log('data:',data)
            console.log('setid:', setId)
            setFlashcards(data)
            setOriginalFlashcardIds(data?.map((card) => card.id) ?? [])
        }
        catch(error){
            throw(error)
        } finally{
            
            setIsLoading(false)
        }
    }

  const addNewCard = () => {
    const newCard: Flashcard = {
      id: crypto.randomUUID(),
      author_id: user?.id,
      front: "",
      back: "",
    }
    console.log(setId, setTitle);
    setFlashcards((prev) => (prev ? [...prev, newCard] : [newCard]))
  }

  const updateCard = (id: string, field: "front" | "back", value: string) => {
    setFlashcards((prev) =>
        prev ? prev.map((card) => (card.id === id ? { ...card, [field]: value } : card)) : []
      )
  }

  const deleteCard = (id: string) => {
    setFlashcards((prev) => (prev ? prev.filter((card) => card.id !== id) : []))
  }

  const saveChanges = async () => {
    if(!Flashcards) return
    setIsLoading(true)

  try {
    
    const currentIds = Flashcards?.map((c) => c.id).filter((id): id is string => !!id && id.length === 36) ?? []
    const deletedIds = originalFlashcardIds.filter((id) => !currentIds.includes(id))

    // 3. Delete removed flashcards
    if (deletedIds.length > 0) {
      const { error: deleteError } = await supabase
        .from("flashcards")
        .delete()
        .in("id", deletedIds)

      if (deleteError) {
        throw deleteError
      }
    }

    // 4. Upsert new and updated cards
    const { error: upsertError } = await supabase
      .from("flashcards")
      .upsert(Flashcards, { onConflict: "id" })

    if (upsertError) {
      throw upsertError
    }

    console.log("Flashcards saved.")
    router.back()
  } catch (err) {
    console.error("Error saving flashcards:", err)
    alert("Failed to save flashcards.")
  } finally {
    setIsLoading(false)
  }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFC300"/>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit {setTitle} </Text>
        </View>
        <TouchableOpacity onPress={saveChanges} style={styles.saveButton}>
          <Ionicons name="save" size={24} color={COLORS.primary} style={styles.saveIcon} />
        </TouchableOpacity>
      </View>


      <Text style={styles.cardCount}>{Flashcards?.length} cards</Text>


        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          {Flashcards?.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No cards yet. Add your first card below.</Text>
            </View>
          ) : (
            Flashcards?.map((card, index) => (
              <View key={card.id} style={styles.cardContainer}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardIndex}>Card {index + 1}</Text>
                  <TouchableOpacity onPress={() => deleteCard(card.id)}>
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Question</Text>
                  <TextInput
                    value={card.front}
                    onChangeText={(text) => updateCard(card.id, "front", text)}
                    style={styles.textInput}
                    placeholder="Enter question"
                    placeholderTextColor="#6b7280"
                    multiline
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Answer</Text>
                  <TextInput
                    value={card.back}
                    onChangeText={(text) => updateCard(card.id, "back", text)}
                    style={styles.textInput}
                    placeholder="Enter answer"
                    placeholderTextColor="#6b7280"
                    multiline
                  />
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.addButtonContainer}>
          <TouchableOpacity onPress={addNewCard} style={styles.addButton}>
            <Ionicons name="add" size={20} color="#fff" style={styles.addIcon} />
            <Text style={styles.addButtonText}>Add New Card</Text>
          </TouchableOpacity>
        </View>


    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    // borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
    color: COLORS.primary
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  saveButton: {
    // backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  saveIcon: {
    marginRight: 4,
  },
  saveButtonText: {
    color: "#000",
    fontWeight: "500",
  },
  cardCount: {
    padding: 16,
    color: "#9ca3af",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyStateText: {
    color: "#6b7280",
    textAlign: "center",
  },
  cardContainer: {
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardIndex: {
    color: "#9ca3af",
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: "#1f2937",
    borderRadius: 6,
    padding: 12,
    color: "#fff",
    minHeight: 80,
  },
  addButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  addButton: {
    backgroundColor: "#1f2937",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 6,
  },
  addIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: "#fff",
  },
  fab: {
    position: "absolute",
    bottom: 90,
    right: 16,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
})

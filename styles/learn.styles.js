import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 30,
  },
  topicItem: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  learnHint: {
    color: '#AAA',
    fontSize: 14,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginTop: 20,
    padding: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  explanationText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontFamily: 'System'
  }
});

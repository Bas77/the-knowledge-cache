import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '@/constants/theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    alignItems: 'center',
  },
  
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 30,
    fontFamily: 'Poppins-Bold',
  },
  cardContainer: {
    width: width * 0.9,
    height: width * 0.6,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    position: 'absolute',
  },
  cardFront: {
    backgroundColor: COLORS.surface,
    borderColor: 'white',
    borderWidth: 2
  },
  cardBack: {
    backgroundColor: COLORS.surfaceLight,
    borderColor: COLORS.primary,
    borderWidth: 2
  },
  cardTitle: {
    position: 'absolute',
    top: 40,
    fontFamily: 'Poppins-Bold',
    color: COLORS.primary,
    fontSize: 20
  },
  cardText: {
    fontSize: 18,
    textAlign: 'center',
    color: COLORS.white,
    fontFamily: 'Poppins-Medium',
  },
  tapHint: {
    position: 'absolute',
    bottom: 15,
    fontSize: 14,
    color: COLORS.white,
    fontFamily: 'Poppins-Regular',
  },
  progressText: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 30,
    fontFamily: 'Poppins-Regular',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginBottom: 30,
  },
  navButton: {
    padding: 15,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  flipButton: {
    alignItems: 'center',
    padding: 15,
  },
  flipText: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 5,
    fontFamily: 'Poppins-Medium',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  backText: {
    color: COLORS,
    fontFamily: 'Poppins-Medium',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  helpButton: {
    padding: 5,
    marginBottom: 30
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 20,
    textAlign: 'center',
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  helpText: {
    fontSize: 13,
    color: COLORS.white,
    marginLeft: 10,
    padding: 5
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseText: {
    color: 'black',
    fontWeight: 'bold',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
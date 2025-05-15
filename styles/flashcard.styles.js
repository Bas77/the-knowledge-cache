import { COLORS } from "@/constants/theme";
import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchButton: {
    padding: 8,
  },
  listContainer: {
    paddingBottom: 100,
  },
  setItem: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedSetItem: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  setInfo: {
    marginBottom: 10,
  },
  setTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  setCount: {
    color: '#AAA',
    fontSize: 14,
  },
  setItemButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  setItemButtonEdit: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
  },
  setItemButtonTest: {
    flex: 1,
    backgroundColor: '#028A0F',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
  },
  setItemButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  deleteButton: {
    alignSelf: 'center',
    marginTop: 3,
    marginLeft: 5,
    color: COLORS.error,
  },
  createButton: {
    position: 'absolute',
    bottom: 100,
    right: 15,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  createButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 24,
    width: width * 0.9, // Use 90% of screen width
    maxWidth: 400
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalMessage: {
    color: '#CCC',
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: COLORS.surfaceLight,
  },
  cancelText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  deleteConfirmButton: {
    backgroundColor: '#ff4444',
  },
  deleteConfirmText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    marginTop: 16,
    color: COLORS.textSecondary,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  ownerBadge: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: '30%', // Ensures buttons have minimum width
  },
  cancelButton: {
    backgroundColor: COLORS.surfaceLight,
    // marginRight: 8, // Add some spacing between buttons
  },
  deleteForMeButton: {
    backgroundColor: COLORS.error,
    marginHorizontal: 8, // Add spacing on both sides
  },
  deleteForAllButton: {
    backgroundColor: COLORS.error,
    // marginLeft: 8, // Add spacing on left
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 92, 92, 0.1)",
  },
});

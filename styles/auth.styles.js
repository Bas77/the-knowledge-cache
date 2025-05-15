import { COLORS } from "@/constants/theme"
import { StyleSheet, Dimensions } from "react-native"

const { width, height } = Dimensions.get("window")

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    fontFamily: "Poppins-Regular",
  },
  brandSection: {
    alignItems: "center",
    marginTop: height * 0.12,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "rgba(74, 222, 128, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  signUpTitle: {
    fontSize: 42,
    fontWeight: "700",
    fontFamily: "JetBrainsMono-Medium",
    color: COLORS.primary,
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 50,
  },
  appName: {
    fontSize: 42,
    fontWeight: "700",
    fontFamily: "JetBrainsMono-Medium",
    color: COLORS.primary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.grey,
    letterSpacing: 1,
    textTransform: "lowercase",
  },
  /* ----------------------------------------------------------- */
  loginItems: {
    paddingTop: 50,
  },
  loginLabel: {
    color: COLORS.primary,
    fontSize: 20,
    paddingBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#FF5C5C",
    borderWidth: 1,
  },
  errorText: {
    color: "#FF5C5C",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 15,
    paddingLeft: 5,
  },
  button: {
    backgroundColor: COLORS.secondary,
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 130,
  },
  buttonText: {
    color: COLORS.surfaceLight,
    fontSize: 18,
    fontWeight: "600",
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  googleButtonText: {
    color: COLORS.surfaceLight,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  signUpText: {
    marginTop: 15,
    fontSize: 16,
    color: "#555",
  },
  signUpLink: {
    color: "#fff",
    fontWeight: "bold",
  },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.grey,
    paddingTop: 20,
    // maxWidth: 280,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },

  // Updated modal styles to match profile edit modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#1E1E1E",
    borderRadius: 15,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  closeButton: {
    padding: 5,
  },
  modalInput: {
    width: "100%",
    height: 50,
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#2A2A2A",
    color: "#FFF",
  },
  modalLoginLabel: {
    color: COLORS.primary,
    fontSize: 16,
    marginBottom: 8,
  },
  pickImageButton: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  pickImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  pickImageText: {
    color: "#FFF",
    marginTop: 5,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
})


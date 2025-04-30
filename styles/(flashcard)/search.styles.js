import { COLORS } from "@/constants/theme";
import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      padding: 20,
    },
    header: {
      color: '#FFF',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    searchButton: {
      padding: 8,
      color: COLORS.primary,
      marginBottom: 20,
      // backgroundColor: COLORS.primary
    },
    listContainer: {
      paddingBottom: 20,
    //   borderColor: 'red',
    //   borderWidth: 2
    },
    setItem: {
      backgroundColor: COLORS.surfaceLight,
      borderWidth: 1,
      borderColor: '#FFF',
      borderRadius: 10,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'column',

    },
    selectedSetItem: {
      borderColor: COLORS.primary,
      borderWidth: 2,
    //   paddingBottom: 0,
      
    },
    setItemButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 10,
    },
    setItemButtonEdit: {
        flexDirection: 'column',
        backgroundColor: COLORS.secondary,
        width: '30%',
        // padding: 20,
        // height: 20,
        borderRadius: 25,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        margin: 15,
        bottom: -20,
        left: 50
    },
    setItemButtonTest: {
        flexDirection: 'column',
        backgroundColor: '#028A0F',
        width: '30%',
        // padding: 20,
        // height: 20,
        borderRadius: 25,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        margin: 15,
        bottom: -20,
        left: 50
    },
    setItemButtonText: {
        margin: 10,
        fontFamily: 'Poppins-SemiBold'
    },
    deleteButton: {
        color: COLORS.error,
        // position: 'absolute',
        // bottom: 20,
        // left: -280,
        // bottom: -1
    },
    setInfo: {
      flex: 1,
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
  });
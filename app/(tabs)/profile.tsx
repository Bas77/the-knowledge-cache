import {View, Text, TouchableOpacity } from 'react-native'
import { Redirect, router, useRouter } from 'expo-router';
import {styles} from '@/styles/auth.styles'
export default function Profile(){
    return(
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',}} >
            <TouchableOpacity style={styles.button} onPress={()=> router.push('/(auth)/login')}><Text>Sign out</Text></TouchableOpacity>
        </View>
        
    )
}
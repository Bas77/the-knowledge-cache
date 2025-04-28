import {View, Text} from 'react-native'
import { Redirect, router, useRouter } from 'expo-router';
export default function Profile(){
    return(
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',}} >
            <Text style={{ padding: 10, backgroundColor: 'black'}} onPress={()=> router.push('/(auth)/login')}>test</Text>
        </View>
        
    )
}
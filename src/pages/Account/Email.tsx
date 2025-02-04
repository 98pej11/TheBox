import {TouchableOpacity, View, Text, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {styles as S} from './Create.styles';
import {RootStackParamList} from '../../types/navigationTypes';
import {accountStore} from '../../stores/accountStore';

export default function Email() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={S.container}>
      <View style={S.inputBox}>
        <Text style={S.textA}>what’s your email</Text>
        <TextInput
          style={S.inputField}
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={text => accountStore.setLoginId(text)}
        />
      </View>
      <View style={S.buttonBox}>
        <Text style={S.textB}>Terms of service and policy</Text>
        <TouchableOpacity
          style={S.buttonB}
          onPress={() => {
            console.log(accountStore.loginId);
            // accountStore.sendEmailCode();
            navigation.navigate('Verification', {from: 'email'});
          }}>
          <Text style={S.buttonTextB}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

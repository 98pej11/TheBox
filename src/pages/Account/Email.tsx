import {TouchableOpacity, View, Text, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {styles as S} from './Create.styles';
import {RootStackParamList} from '../../types/navigationTypes';

export default function Email() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={S.container}>
      <View style={S.inputBox}>
        <Text style={S.textA}>what’s your email</Text>
        <TextInput
          style={S.inputField} // 스타일을 추가하여 텍스트 입력 필드를 디자인
          placeholder="Email"
          keyboardType="email-address" // 이메일 입력 시 사용
        />
      </View>
      <View style={S.buttonBox}>
        <Text style={S.textB}>Terms of service and policy</Text>
        <TouchableOpacity
          style={S.buttonB}
          onPress={() => navigation.navigate('Verification', {from: 'email'})}>
          <Text style={S.buttonTextB}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

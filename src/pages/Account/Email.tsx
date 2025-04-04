import {TouchableOpacity, View, Text, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {styles as S} from './Create.styles';
import {RootStackParamList} from '../../types/navigationTypes';
import {accountStore} from '../../stores/accountStore';
import {useState} from 'react';

export default function Email() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);

  // 이메일 형식 검사 함수
  const validateEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  };

  // 입력값이 변경될 때마다 상태 업데이트 및 유효성 검사
  const handleEmailChange = (text: string) => {
    setEmail(text);
    setIsValid(validateEmail(text));
    accountStore.setLoginId(text); // store에도 저장
  };

  return (
    <View style={S.container}>
      <View style={S.inputBox}>
        <Text style={S.textA}>what’s your email</Text>
        <TextInput
          style={S.inputField}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none" // 대문자 변경 방지
          onChangeText={handleEmailChange}
        />
      </View>
      <View style={S.buttonBox}>
        <Text style={S.textB}>Terms of service and policy</Text>
        <TouchableOpacity
          style={isValid ? S.buttonA : S.buttonB}
          disabled={!isValid}
          onPress={() => {
            console.log(accountStore.loginId);
            accountStore.sendEmailCode();
            navigation.navigate('Verification', {from: 'email'});
          }}>
          <Text style={isValid ? S.buttonTextA : S.buttonTextB}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

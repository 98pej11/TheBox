import {TouchableOpacity, View, Text, TextInput} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {styles as S} from './Login.styles';
import {useState} from 'react';
import {accountStore} from '../../stores/accountStore';
import {RootStackParamList} from '../../types/navigationTypes';

export default observer(function Login() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleIdChange = (value: string) => {
    accountStore.loginId = value; // Store의 email 업데이트
  };

  const handlePasswordChange = (value: string) => {
    accountStore.password = value; // Store의 password 업데이트
  };

  const handleLogin = () => {
    // accountStore.setLogin();
    // accountStore.setSignUp();
    navigation.navigate('MyFeed');
  };

  return (
    <View style={S.container}>
      <View style={S.inputBox}>
        <TextInput
          style={S.inputField} // 스타일을 추가하여 텍스트 입력 필드를 디자인
          placeholder="Number or Email"
          keyboardType="email-address" // 이메일 입력 시 사용
          value={accountStore.loginId} // Store의 email 값 사용
          onChangeText={handleIdChange}
        />
        <TextInput
          style={S.inputField}
          placeholder="Password"
          secureTextEntry={true} // 비밀번호 입력 시 텍스트가 보이지 않도록 설정
          value={accountStore.password} // Store의 email 값 사용
          onChangeText={handlePasswordChange}
        />
      </View>
      <View style={S.buttonBox}>
        <TouchableOpacity style={S.buttonB} onPress={handleLogin}>
          <Text style={S.buttonTextB}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

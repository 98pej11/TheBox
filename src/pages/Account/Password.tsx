import {TouchableOpacity, View, Text, TextInput, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {styles as S} from './Create.styles';
import {RootStackParamList} from '../../types/navigationTypes';
import {accountStore} from '../../stores/accountStore';
import {useState} from 'react';

export default function Password() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [check, setCheck] = useState('');

  return (
    <View style={S.container}>
      <View style={S.inputBox}>
        <Text style={S.textA}>choose a password</Text>
        <TextInput
          style={S.inputField}
          placeholder="password"
          secureTextEntry={true} // 비밀번호 입력 시 문자가 보이지 않게 처리
          keyboardType="default" // 일반적인 키보드 타입
          onChangeText={text => accountStore.setPassword(text)}
        />
        <TextInput
          style={S.inputField}
          placeholder="password check"
          secureTextEntry={true} // 비밀번호 입력 시 문자가 보이지 않게 처리
          keyboardType="default" // 일반적인 키보드 타입
          value={check} // ✅ check 상태 적용
          onChangeText={text => setCheck(text)} // ✅ check 상태 업데이트
        />
      </View>
      <View style={S.buttonBox}>
        <TouchableOpacity
          style={S.buttonB}
          onPress={() => {
            if (accountStore.password === check) {
              navigation.navigate('Name');
            } else {
              Alert.alert('Error', 'Passwords do not match');
            }
          }}>
          <Text style={S.buttonTextB}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

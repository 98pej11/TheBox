import {TouchableOpacity, View, Text, TextInput, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {styles as S} from './Create.styles';
import {RootStackParamList} from '../../types/navigationTypes';
import {accountStore} from '../../stores/accountStore';
import {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';

export default observer(function Password() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [check, setCheck] = useState('');
  const [isError, setIsError] = useState(false);

  const isValid = accountStore.password === check;

  useEffect(() => {
    setIsError(!isValid && check.length > 0); // ❗비밀번호 불일치 시 true
  }, [accountStore.password, check]);

  return (
    <View style={S.container}>
      <View style={S.inputBox}>
        <Text style={S.textA}>choose a password</Text>
        <TextInput
          style={[S.inputField, isError && {borderColor: 'red'}]}
          placeholder="password"
          secureTextEntry={true} // 비밀번호 입력 시 문자가 보이지 않게 처리
          keyboardType="default" // 일반적인 키보드 타입
          onChangeText={text => accountStore.setPassword(text)}
        />
        <TextInput
          style={[S.inputField, isError && {borderColor: 'red'}]}
          placeholder="password check"
          secureTextEntry={true} // 비밀번호 입력 시 문자가 보이지 않게 처리
          keyboardType="default" // 일반적인 키보드 타입
          value={check} // ✅ check 상태 적용
          onChangeText={text => setCheck(text)} // ✅ check 상태 업데이트
        />
        {isError && (
          <Text style={{color: 'red', marginTop: 3}}>
            Passwords do not match
          </Text>
        )}
      </View>
      <View style={S.buttonBox}>
        <TouchableOpacity
          style={isValid ? S.buttonA : S.buttonB} // ✅ 버튼 색상 변경
          disabled={!isValid}
          onPress={() => {
            if (accountStore.password.length < 8) {
              Alert.alert('your password must be of least 8 characters');
              return;
            }
            navigation.navigate('Name');
          }}>
          <Text style={isValid ? S.buttonTextA : S.buttonTextB}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

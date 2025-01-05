import {TouchableOpacity, View, Text, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {styles as S} from './Create.styles';
import {RootStackParamList} from '@src/types/navigationTypes';

export default function Password() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={S.container}>
      <View style={S.inputBox}>
        <Text style={S.textA}>choose a password</Text>
        <TextInput
          style={S.inputField}
          placeholder="password"
          secureTextEntry={true} // 비밀번호 입력 시 문자가 보이지 않게 처리
          keyboardType="default" // 일반적인 키보드 타입
        />
        <TextInput
          style={S.inputField}
          placeholder="password check"
          secureTextEntry={true} // 비밀번호 입력 시 문자가 보이지 않게 처리
          keyboardType="default" // 일반적인 키보드 타입
        />
      </View>
      <View style={S.buttonBox}>
        <TouchableOpacity
          style={S.buttonB}
          onPress={() => navigation.navigate('Name')}>
          <Text style={S.buttonTextB}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

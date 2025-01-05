import {TouchableOpacity, View, Text, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {styles as S} from './Login.styles';

export default function Login() {
  //   const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={S.container}>
      <View style={S.inputBox}>
        <TextInput
          style={S.inputField} // 스타일을 추가하여 텍스트 입력 필드를 디자인
          placeholder="Number or Email"
          keyboardType="email-address" // 이메일 입력 시 사용
        />
        <TextInput
          style={S.inputField}
          placeholder="Password"
          secureTextEntry={true} // 비밀번호 입력 시 텍스트가 보이지 않도록 설정
        />
      </View>
      <View style={S.buttonBox}>
        <TouchableOpacity style={S.buttonB} onPress={() => {}}>
          <Text style={S.buttonTextB}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

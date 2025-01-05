import {TouchableOpacity, View, Text, TextInput, Modal} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {styles as S} from './Create.styles';
import {RootStackParamList} from '@src/types/navigationTypes';

export default function Verification() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Verification'>>(); // route 매개변수 사용
  const from = route.params?.from;

  return (
    <View style={S.container}>
      <View style={S.inputBox}>
        <Text style={S.textA}>
          verify your {from === 'email' ? 'email' : 'number'}
        </Text>{' '}
        <TextInput
          style={S.inputField} // 스타일을 추가하여 텍스트 입력 필드를 디자인
          placeholder="6 Digit Code"
          keyboardType="numeric" // 이메일 입력 시 사용
        />
      </View>
      <View style={S.buttonBox}>
        <TouchableOpacity
          style={S.buttonB}
          onPress={() => {
            if (from === 'email') {
              navigation.navigate('Password');
            } else if (from === 'number') {
              navigation.navigate('Email');
            }
          }}>
          <Text style={S.buttonTextB}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

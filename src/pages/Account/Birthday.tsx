import {TouchableOpacity, View, Text, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {styles as S} from './Create.styles';
import {RootStackParamList} from '../../types/navigationTypes';

export default function Birthday() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={S.container}>
      <View style={S.inputBox}>
        <Text style={S.textA}>what's your birthday</Text>
        <TextInput
          style={S.inputField}
          placeholder="first name"
          keyboardType="default" // 일반적인 키보드 타입
        />
      </View>
      {/* <View style={S.buttonBox}>
        <TouchableOpacity
          style={S.buttonB}
          onPress={() => navigation.navigate('Birthday')}>
          <Text style={S.buttonTextB}>Continue</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

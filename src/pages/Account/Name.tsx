import {TouchableOpacity, View, Text, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {styles as S} from './Create.styles';
import {RootStackParamList} from '../../types/navigationTypes';
import {accountStore} from '../../stores/accountStore';

export default function Name() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={S.container}>
      <View style={S.inputBox}>
        <Text style={S.textA}>what's your name</Text>
        <TextInput
          style={S.inputField}
          placeholder="first name"
          keyboardType="default"
          onChangeText={text => accountStore.setFirstName(text)}
        />
        <TextInput
          style={S.inputField}
          placeholder="last name"
          keyboardType="default"
          onChangeText={text => accountStore.setLastName(text)}
        />
      </View>
      <View style={S.buttonBox}>
        <TouchableOpacity
          style={S.buttonB}
          onPress={() => navigation.navigate('Birthday')}>
          <Text style={S.buttonTextB}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

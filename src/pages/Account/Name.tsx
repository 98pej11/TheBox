import {TouchableOpacity, View, Text, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {styles as S} from './Create.styles';
import {RootStackParamList} from '../../types/navigationTypes';
import {accountStore} from '../../stores/accountStore';
import {observer} from 'mobx-react-lite';

export default observer(function Name() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const isValid =
    accountStore.userInfo.firstName && accountStore.userInfo.lastName;

  return (
    <View style={S.container}>
      <View style={S.inputBox}>
        <Text style={S.textA}>what's your name</Text>
        <TextInput
          style={S.inputField}
          placeholder="first name"
          keyboardType="default"
          value={accountStore.userInfo.firstName}
          onChangeText={text => (accountStore.userInfo.firstName = text)}
        />
        <TextInput
          style={S.inputField}
          placeholder="last name"
          keyboardType="default"
          value={accountStore.userInfo.lastName}
          onChangeText={text => (accountStore.userInfo.lastName = text)}
        />
      </View>
      <View style={S.buttonBox}>
        <TouchableOpacity
          style={isValid ? S.buttonA : S.buttonB}
          disabled={!isValid}
          onPress={() => {
            console.log(
              accountStore.userInfo.firstName +
                ' ' +
                accountStore.userInfo.lastName,
            );
            navigation.navigate('Birthday');
          }}>
          <Text style={isValid ? S.buttonTextA : S.buttonTextB}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

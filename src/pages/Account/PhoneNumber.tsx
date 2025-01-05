import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
  Keyboard,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {styles as S} from './Create.styles';
import React, {useState} from 'react';
import {RootStackParamList} from '@src/types/navigationTypes';

export default function PhoneNumber() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+82'); // 기본값을 +82로 설정

  return (
    <View style={S.container}>
      <View style={S.inputBox}>
        <Text style={S.textA}>what’s your number</Text>
        <View style={S.countryCodeBox}>
          <RNPickerSelect
            onValueChange={value => setCountryCode(value)}
            items={[
              {label: '+1', value: '+1'}, // 미국
              {label: '+82', value: '+82'}, // 한국
              {label: '+44', value: '+44'}, // 영국
            ]}
            value={countryCode}
            style={{
              inputIOS: S.picker,
              inputAndroid: S.picker,
            }}
          />
          <TextInput
            placeholder="Number or Email"
            keyboardType="email-address" // 이메일 입력 시 사용
          />
        </View>
      </View>
      <View style={S.buttonBox}>
        <Text style={S.textB}>Terms of service and policy</Text>
        <TouchableOpacity
          style={S.buttonB}
          onPress={() => navigation.navigate('Verification', {from: 'number'})}>
          <Text style={S.buttonTextB}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

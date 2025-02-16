import {TouchableOpacity, View, Text, TextInput, Modal} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {styles as S} from './Create.styles';
import {RootStackParamList} from '../../types/navigationTypes';
import {accountStore} from '../../stores/accountStore';
import {postEmailVerification} from '../../apis/postEmailVerification';
import {runInAction} from 'mobx';
import {observer} from 'mobx-react-lite';
// import {RootStackParamList} from '@src/types/navigationTypes';

export default observer(function Verification() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Verification'>>(); // route 매개변수 사용
  const from = route.params?.from;

  const isValid = accountStore.digitCode.length === 6;

  return (
    <View style={S.container}>
      <View style={S.inputBox}>
        <Text style={S.textA}>
          verify your {from === 'email' ? 'email' : 'number'}
        </Text>
        <TextInput
          style={S.inputField} // 스타일을 추가하여 텍스트 입력 필드를 디자인
          placeholder="6 Digit Code"
          keyboardType="numeric"
          maxLength={6}
          onChangeText={text => accountStore.setDigitCode(text)}
        />
      </View>
      <View style={S.buttonBox}>
        <TouchableOpacity
          style={isValid ? S.buttonA : S.buttonB}
          onPress={() => {
            console.log(accountStore.userInfo.email, accountStore.digitCode);
            // postEmailVerification(
            //   accountStore.userInfo.email,
            //   accountStore.digitCode,
            // ).then((res: any) => {
            //   console.log('성공', res);
            //   runInAction(() => {
            //     console.log(res);
            //   });
            // });
            if (from === 'email') {
              navigation.navigate('Password');
            } else if (from === 'number') {
              navigation.navigate('Email');
            }
          }}>
          <Text style={isValid ? S.buttonTextA : S.buttonTextB}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

import {TouchableOpacity, View, Text, TextInput, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Picker} from '@react-native-picker/picker';

import {styles as S} from './Create.styles';
import {RootStackParamList} from '../../types/navigationTypes';
import {useState} from 'react';
import {accountStore} from '../../stores/accountStore';
import {observer} from 'mobx-react-lite';

export default observer(function Birthday() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [selectedYear, setSelectedYear] = useState('2000');
  const [selectedMonth, setSelectedMonth] = useState('1');
  const [selectedDay, setSelectedDay] = useState('1');

  const years = Array.from({length: 24}, (_, i) => 2000 + i);
  const months = Array.from({length: 12}, (_, i) => i + 1);
  const days = Array.from({length: 31}, (_, i) => i + 1);

  return (
    <View style={S.container}>
      <View style={S.inputBox}>
        <Text style={S.textA}>what's your birthday</Text>
        <View style={S.pickerBox}>
          <Picker
            selectedValue={selectedYear}
            onValueChange={itemValue => setSelectedYear(itemValue)}
            style={{width: '40%'}} // 각 Picker의 너비 설정
          >
            {years.map(year => (
              <Picker.Item
                key={year}
                label={year.toString()}
                value={year.toString()}
              />
            ))}
          </Picker>
          <Text style={S.separator}>/</Text>
          <Picker
            selectedValue={selectedMonth}
            onValueChange={itemValue => setSelectedMonth(itemValue)}
            style={{width: '30%'}} // 각 Picker의 너비 설정
          >
            {months.map(month => (
              <Picker.Item
                key={month}
                label={month.toString()}
                value={month.toString()}
              />
            ))}
          </Picker>
          <Text style={S.separator}>/</Text>
          <Picker
            selectedValue={selectedDay}
            onValueChange={itemValue => setSelectedDay(itemValue)}
            style={{width: '30%'}} // 각 Picker의 너비 설정
          >
            {days.map(day => (
              <Picker.Item
                key={day}
                label={day.toString()}
                value={day.toString()}
              />
            ))}
          </Picker>
        </View>
      </View>
      <View style={S.buttonBox}>
        <TouchableOpacity
          style={S.buttonA}
          onPress={() => {
            console.log(accountStore.userInfo);
            accountStore.setSignUp();
            Alert.alert('Registration successful.');
            navigation.reset({
              index: 0, // 새로운 스택의 첫 번째 화면으로 설정
              routes: [{name: 'Home'}], // 이동할 화면 설정
            });
          }}>
          <Text style={S.buttonTextA}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

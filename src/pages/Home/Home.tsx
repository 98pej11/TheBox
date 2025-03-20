import {TouchableOpacity, View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {styles as S} from './Home.styles';
import {RootStackParamList} from '../../types/navigationTypes';
import Footer from '../Main/Footer';

export default function Home() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={S.container}>
      {/* <Text>App Logo</Text> */}
      <View style={S.buttonBox}>
        <TouchableOpacity
          style={S.buttonA}
          onPress={() => navigation.navigate('Login')}>
          <Text style={S.buttonTextA}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={S.buttonB}
          onPress={() => navigation.navigate('Email')}>
          <Text style={S.buttonTextB}>Create on Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

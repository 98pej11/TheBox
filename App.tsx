import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './src/pages/Home/Home';
// import Login from '@src/pages/Login/Login'; // Login 페이지가 있다고 가정
// import PhoneNumber from '@src/pages/PhoneNumber/PhoneNumber'; // PhoneNumber 페이지가 있다고 가정
import {RootStackParamList} from './src/types/navigationTypes';
import Login from './src/pages/Account/Login';
import PhoneNumber from './src/pages/Account/PhoneNumber';
import {NativeModules} from 'react-native';
import Verification from './src/pages/Account/Verification';
import Email from './src/pages/Account/Email';
import Password from './src/pages/Account/Password';
import Name from './src/pages/Account/Name';
import Birthday from './src/pages/Account/Birthday';

const Stack = createStackNavigator<RootStackParamList>();
const DevSettings = NativeModules.DevSettings;

function App(): React.JSX.Element {
  useEffect(() => {
    // 앱이 시작될 때 자동으로 원격 디버깅을 활성화
    if (__DEV__ && DevSettings) {
      DevSettings.setIsDebuggingRemotely(true);
    }
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Email" component={Email} />
        <Stack.Screen name="Password" component={Password} />
        <Stack.Screen name="Name" component={Name} />
        <Stack.Screen name="Birthday" component={Birthday} />
        <Stack.Screen name="PhoneNumber" component={PhoneNumber} />
        <Stack.Screen name="Verification" component={Verification} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

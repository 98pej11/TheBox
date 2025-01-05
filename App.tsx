import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './src/pages/Home/Home';
// import Login from '@src/pages/Login/Login'; // Login 페이지가 있다고 가정
// import PhoneNumber from '@src/pages/PhoneNumber/PhoneNumber'; // PhoneNumber 페이지가 있다고 가정
import {RootStackParamList} from './src/types/navigationTypes';
import Login from './src/pages/Account/Login';
import PhoneNumber from './src/pages/Account/PhoneNumber';

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="PhoneNumber" component={PhoneNumber} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

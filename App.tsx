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
import MyFeed from './src/pages/Main/MyFeed';
import ProfileEdit from './src/pages/Main/ProfileEdit';
import FriendList from './src/pages/Main/FriendList';
import FriendFeed from './src/pages/Main/FriendFeed';
import CameraScreen from './src/pages/Main/CameraScreen';
import NewPost from './src/pages/Main/NewPost';

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
        {/** 회원 관련 */}
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerTitle: 'Login', headerBackTitle: ''}}
        />
        <Stack.Screen
          name="Email"
          component={Email}
          options={{headerTitle: 'Create', headerBackTitle: ''}}
        />
        <Stack.Screen
          name="Password"
          component={Password}
          options={{headerTitle: 'Create', headerBackTitle: ''}}
        />
        <Stack.Screen
          name="Name"
          component={Name}
          options={{headerTitle: 'Create', headerBackTitle: ''}}
        />
        <Stack.Screen
          name="Birthday"
          component={Birthday}
          options={{headerTitle: 'Create', headerBackTitle: ''}}
        />
        <Stack.Screen
          name="PhoneNumber"
          component={PhoneNumber}
          options={{headerTitle: 'Create', headerBackTitle: ''}}
        />
        <Stack.Screen
          name="Verification"
          component={Verification}
          options={{headerTitle: 'Create', headerBackTitle: ''}}
        />
        {/** 메인 관련 */}
        <Stack.Screen
          name="MyFeed"
          component={MyFeed}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProfileEdit"
          component={ProfileEdit}
          options={{headerTitle: 'Edit', headerBackTitle: ''}}
        />
        <Stack.Screen
          name="FriendList"
          component={FriendList}
          options={{headerTitle: 'Friends', headerBackTitle: ''}}
        />
        <Stack.Screen
          name="FriendFeed"
          component={FriendFeed}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CameraScreen"
          component={CameraScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NewPost"
          component={NewPost}
          options={{headerTitle: 'New Post', headerBackTitle: ''}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import CameraIcon from '../../statics/icons/camera.svg';
import MapIcon from '../../statics/icons/map.svg';
import ChatIcon from '../../statics/icons/chat.svg';
import UserIcon from '../../statics/icons/user.svg';
import {observer} from 'mobx-react-lite';
import {accountStore} from '../../stores/accountStore';
import {RootStackParamList} from '../../types/navigationTypes';
import {StackNavigationProp} from '@react-navigation/stack';

const icons = [
  {Icon: MapIcon, label: 'Map'},
  {Icon: ChatIcon, label: 'Chat'},
  {Icon: CameraIcon, label: 'CameraScreen'},
  {Icon: UserIcon, label: 'Settings'},
];

// Footer 컴포넌트 내에서 상태 확인
const Footer = observer(() => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const hasProfileImage = accountStore.userProfile.profileImageUrl !== '';

  const handlePress = (label: string) => {
    if (label === 'CameraScreen') {
      navigation.navigate('CameraScreen'); // 'Camera' 화면으로 이동
    }
    // 필요한 경우 다른 탭도 여기에 추가
  };
  return (
    <View style={styles.footer}>
      {icons.map(({Icon, label}, index) => (
        <TouchableOpacity key={index} style={styles.menuItem}>
          <Icon width={30} height={30} onPress={() => handlePress(label)} />
          {/* <Text style={styles.menuText}>{label}</Text> */}
        </TouchableOpacity>
      ))}
      <TouchableOpacity>
        {hasProfileImage ? (
          <Image
            source={{uri: accountStore.userProfile.profileImageUrl}}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.defaultProfileContainer}>
            <Text style={styles.defaultProfileText}>no profile</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#c6c6c6',
    paddingVertical: 20,
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  menuItem: {
    alignItems: 'center',
  },
  menuText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 20, // 동그랗게 만들기
  },
  defaultProfileContainer: {
    width: 30,
    height: 30,
    borderRadius: 20, // 동그랗게 만들기
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  defaultProfileText: {
    fontSize: 5,
    color: '#777',
    fontWeight: '500',
  },
});

export default Footer;

import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import CameraIcon from '../../statics/icons/Footer/camera.svg';
import CameraFillIcon from '../../statics/icons/Footer/camera_fill.svg';
import MapIcon from '../../statics/icons/Footer/map.svg';
import MapFillIcon from '../../statics/icons/Footer/map_fill.svg';
import ChatIcon from '../../statics/icons/Footer/chat.svg';
import ChatFillIcon from '../../statics/icons/Footer/chat_fill.svg';
import UserIcon from '../../statics/icons/Footer/user.svg';
import UserFillIcon from '../../statics/icons/Footer/user_fill.svg';
import {observer} from 'mobx-react-lite';
import {accountStore} from '../../stores/accountStore';
import {RootStackParamList} from '../../types/navigationTypes';
import {StackNavigationProp} from '@react-navigation/stack';

const icons = [
  {Icon: MapIcon, FillIcon: MapFillIcon, label: 'Map'},
  {Icon: ChatIcon, FillIcon: ChatFillIcon, label: 'Chat'},
  {Icon: CameraIcon, FillIcon: CameraFillIcon, label: 'CameraScreen'},
  {Icon: UserIcon, FillIcon: UserFillIcon, label: 'AllPosts'},
];

// Footer 컴포넌트 내에서 상태 확인
const Footer = observer(() => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const hasProfileImage = accountStore.userProfile.profileImageUrl !== '';
  const [activeTab, setActiveTab] = useState<string>(''); // 현재 활성화된 탭

  const handlePress = (label: string) => {
    setActiveTab(label); // 활성화된 탭 설정

    if (label === 'CameraScreen') {
      navigation.navigate('CameraScreen');
    } else if (label === 'AllPosts') {
      navigation.navigate('AllPosts');
    }
    // 추후 추가
  };

  return (
    <View style={styles.footer}>
      {icons.map(({Icon, FillIcon, label}, index) => {
        const isActive = activeTab === label;
        const IconComponent = isActive ? FillIcon : Icon;
        return (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handlePress(label)}>
            <IconComponent width={26} height={26} />
          </TouchableOpacity>
        );
      })}
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
    paddingVertical: 15,
    position: 'absolute',
    bottom: 20,
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
    borderRadius: 20,
  },
  defaultProfileContainer: {
    width: 30,
    height: 30,
    borderRadius: 20,
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

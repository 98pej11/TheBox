import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

import CameraIcon from '../../statics/icons/camera.svg';
import MapIcon from '../../statics/icons/map.svg';
import ChatIcon from '../../statics/icons/chat.svg';
import UserIcon from '../../statics/icons/user.svg';

const icons = [
  {Icon: MapIcon, label: 'Map'},
  {Icon: ChatIcon, label: 'Chat'},
  {Icon: CameraIcon, label: 'Camera'},
  {Icon: UserIcon, label: 'Settings'},
];

const Footer = () => {
  return (
    <View style={styles.footer}>
      {icons.map(({Icon, label}, index) => (
        <TouchableOpacity key={index} style={styles.menuItem}>
          <Icon width={30} height={30} />
          {/* <Text style={styles.menuText}>{label}</Text> */}
        </TouchableOpacity>
      ))}
      <TouchableOpacity>
        <Image
          source={require('../../statics/sky.jpg')}
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  );
};

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
});

export default Footer;

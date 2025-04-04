import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';

import PlusFriendIcon from '../../statics/icons/plus_friend.svg';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/navigationTypes';
import {observer} from 'mobx-react-lite';
import {accountStore} from '../../stores/accountStore';

export default observer(function MyProfile() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleLinkPress = () => {
    Linking.openURL(accountStore.userProfile.profileLink);
  };

  const handleFriendsButtonPress = () => {
    navigation.navigate('Friends');
  };

  // 프로필 이미지가 있는지 확인
  const hasProfileImage = accountStore.userProfile.profileImageUrl !== '';

  // 소개글이 없으면 하이픈 처리
  const profileMessage =
    accountStore.userProfile.profileMessage !== ''
      ? accountStore.userProfile.profileMessage
      : '-';

  // 링크가 있는지 확인
  const hasProfileLink = accountStore.userProfile.profileLink !== '';

  return (
    <View style={styles.container}>
      <View style={[styles.totalBox, !hasProfileLink && styles.totalBoxNoLink]}>
        <View>
          <Text style={styles.nickname}>
            {accountStore.userInfo.lastName} {accountStore.userInfo.firstName}
          </Text>
          <Text style={styles.introduce}>{profileMessage}</Text>
        </View>
        <View style={styles.profileBox}>
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
        </View>
      </View>

      {/* 링크가 있을 때만 링크 컨테이너 표시 */}
      {hasProfileLink && (
        <View style={styles.linkContainer}>
          <Text style={styles.linkText} onPress={handleLinkPress}>
            {accountStore.userProfile.profileLink}
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('ProfileEdit');
          }}>
          <Text style={styles.buttonText}>프로필 관리</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleFriendsButtonPress}>
          <Text style={styles.buttonText}>친구 관리</Text>
        </TouchableOpacity>
        <PlusFriendIcon />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingVertical: 10,
  },
  nickname: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  totalBox: {
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0, // 기본 마진
  },
  totalBoxNoLink: {
    marginBottom: 10, // 링크가 없을 때 추가 마진
  },
  profileBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 100,
  },
  introduceBox: {},
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  defaultProfileContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  defaultProfileText: {
    fontSize: 14,
    color: '#777',
    fontWeight: '500',
  },
  introduce: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  linkContainer: {
    paddingHorizontal: 40,
    // marginTop: 20,
    marginBottom: 15,
  },
  linkText: {
    fontSize: 16,
    color: '#587fd3',
  },
  buttonContainer: {
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#DBDBDB',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
  },
});

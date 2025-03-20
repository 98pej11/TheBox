import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/navigationTypes';

const FriendProfile = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleLinkPress = () => {
    Linking.openURL('https://www.naver.com'); // URL 클릭 시 열리는 링크
  };

  return (
    <View style={styles.container}>
      <View style={styles.totalBox}>
        <View style={styles.introduceBox}>
          <View>
            <Text style={styles.nickname}>eunjung</Text>
            <Text style={styles.textA}>Frontend Developer</Text>
          </View>
          <Text
            style={styles.linkText}
            onPress={handleLinkPress} // 클릭 시 링크 열기
          >
            www.naver.com
          </Text>
        </View>
        <View style={styles.profileBox}>
          {/* 왼쪽: 프로필 사진 */}
          <Image
            source={require('../../statics/sky.jpg')}
            style={styles.profileImage}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>메세지 보내기</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <Text>no datas</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingVertical: 10,
  },
  nickname: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  totalBox: {
    paddingHorizontal: 40,
    flexDirection: 'row', // introduceBox와 profileBox를 수평으로 배치
    justifyContent: 'space-between', // 양 끝으로 배치
    alignItems: 'center', // 수직으로 가운데 정렬
    marginBottom: 20, // 아래 여백
  },
  profileBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 100,
  },
  introduceBox: {
    // marginTop: 15,
    gap: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  statsContainer: {
    flexDirection: 'row',
    marginRight: 20,
  },
  stat: {
    alignItems: 'center',
    marginLeft: 30,
  },
  statCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
  },

  textA: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
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
    marginTop: 20,
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

export default FriendProfile;

import React from 'react';
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
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {putMyProfile} from '../../apis/putMyProfile';
import {postImgUpload} from '../../apis/postImgUpload';

const MyProfile = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleLinkPress = () => {
    Linking.openURL('https://www.naver.com');
  };

  const handleFriendsButtonPress = () => {
    navigation.navigate('Friends');
  };

  // 권한 요청 함수
  const requestGalleryPermission = async () => {
    try {
      const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (result === RESULTS.GRANTED) {
        openGallery();
      } else {
        console.log('Permission denied');
      }
    } catch (error) {
      console.error('Permission error: ', error);
    }
  };

  // 갤러리에서 이미지 선택 후 업로드
  const openGallery = () => {
    launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedAsset = response.assets[0];
        const {uri, fileName, fileSize, type} = selectedAsset;

        if (!fileName || !fileSize || !type) {
          console.log('Invalid file data');
          return;
        }

        try {
          // Step 1: Pre-signed URL 요청
          const {filePath, preSignedUrl} = await postImgUpload(
            fileName,
            fileSize,
            type,
          );

          if (!filePath || !preSignedUrl) {
            throw new Error('Pre-signed URL 요청 실패');
          }

          // Step 2: S3에 이미지 업로드
          await axios.put(
            preSignedUrl,
            {
              uri,
              type,
              name: fileName,
            },
            {
              headers: {
                'Content-Type': type,
                'Content-Length': fileSize.toString(),
              },
            },
          );

          await putMyProfile(filePath, '프로필 업데이트 완료');
          console.log('프로필 업데이트 성공');
        } catch (error) {
          console.error('업로드 실패:', error);
        }
      } else {
        console.log('No image selected');
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.totalBox}>
        <View style={styles.introduceBox}>
          <Text style={styles.nickname}>eunjung</Text>
          <Text style={styles.textA}>Frontend Developer</Text>
          <Text style={styles.linkText} onPress={handleLinkPress}>
            www.naver.com
          </Text>
        </View>
        <View style={styles.profileBox}>
          <Image
            source={require('../../statics/sky.jpg')}
            style={styles.profileImage}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={requestGalleryPermission}>
          <Text style={styles.buttonText}>프로필 관리</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleFriendsButtonPress}>
          <Text style={styles.buttonText}>친구 관리</Text>
        </TouchableOpacity>
        <PlusFriendIcon />
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

export default MyProfile;

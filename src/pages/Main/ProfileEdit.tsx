import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {putMyProfile} from '../../apis/putMyProfile';
import {postImgUpload} from '../../apis/postImgUpload';
import {observer} from 'mobx-react-lite';
import axios from 'axios'; // Axios를 사용하여 이미지 업로드 처리
import {useNavigation} from '@react-navigation/native';
import {accountStore} from '../../stores/accountStore';

const ProfileEdit = observer(() => {
  const navigation = useNavigation();

  const [nickname, setNickname] = useState(accountStore.loginId || '');
  const [profileMessage, setProfileMessage] = useState(
    accountStore.userProfile.profileMessage || '',
  );
  const [profileLink, setProfileLink] = useState(
    accountStore.userProfile.profileLink || '',
  );
  const [profileImageUri, setProfileImageUri] = useState(
    accountStore.userProfile.profileImageUrl || '',
  );

  // 갤러리 권한 요청 함수
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
            'PROFILE_IMAGE',
          );
          console.log('preSignedUrl:', preSignedUrl);
          if (!filePath || !preSignedUrl) {
            throw new Error('Pre-signed URL 요청 실패');
          }
          if (!uri) {
            throw new Error('이미지 URI가 없습니다');
          }

          const fetchResponse = await fetch(uri);
          console.log(fetchResponse);
          const blob = await fetchResponse.blob();
          console.log(blob);

          try {
            const response = await fetch(preSignedUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': type,
                'Content-Length': fileSize.toString(),
              },
              body: blob,
            });

            // Check if the request was successful
            if (response.status === 200) {
              console.log('File uploaded successfully');
            } else {
              console.log('Failed to upload file. Status:', response.status);
            }
          } catch (error) {
            console.error('Error during file upload:', error);
          }

          setProfileImageUri(filePath);
        } catch (error) {
          console.error('업로드 실패:', error);
        }
      } else {
        console.log('No image selected');
      }
    });
  };

  // 프로필 저장 함수
  const handleSave = async () => {
    try {
      // 1. MobX 스토어 상태 업데이트
      accountStore.updateProfile(profileImageUri, profileMessage, profileLink);

      // 2. 서버에 변경사항 저장
      await putMyProfile(profileImageUri, profileMessage, profileLink);
      navigation.goBack();
      console.log(profileImageUri);
      console.log('Profile saved successfully');
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={requestGalleryPermission}>
          {accountStore.userProfile.profileImageUrl ? (
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
        <Text style={styles.imageText}>사진 수정</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>닉네임</Text>
          <TextInput
            value={nickname}
            onChangeText={setNickname}
            style={styles.input}
            placeholder="닉네임을 입력하세요"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>소개글</Text>
          <TextInput
            value={profileMessage}
            onChangeText={setProfileMessage}
            style={[styles.input, {height: 100, textAlignVertical: 'top'}]}
            placeholder="소개글을 입력하세요"
            multiline
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>링크</Text>
          <TextInput
            value={profileLink}
            onChangeText={setProfileLink}
            style={styles.input}
            placeholder="링크를 입력하세요"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.buttonA} onPress={handleSave}>
        <Text style={styles.buttonTextA}>Confirm</Text>
      </TouchableOpacity>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  defaultProfileContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
  imageText: {
    color: '#007AFF', // 하늘색
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
  },
  form: {
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
    width: 80,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    fontSize: 16,
    color: '#333',
  },
  buttonA: {
    color: '#fff',
    backgroundColor: '#007AFF',
    height: 50,
    padding: 10,
    marginBottom: 10,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center', // 가로 면적을 줄이기 위해 'stretch' 대신 'center'로 변경
    width: '40%', // 버튼 가로 크기를 80%로 설정
  },
  buttonTextA: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileEdit;

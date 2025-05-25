import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCameraFormat,
} from 'react-native-vision-camera';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/navigationTypes';
import CameraSwitchIcon from '../../statics/icons/camera_switch.svg';
import CameraCloseIcon from '../../statics/icons/camera_close.svg';
import CameraUploadIcon from '../../statics/icons/camera_upload.svg';
import CameraRevertIcon from '../../statics/icons/camera_revert.svg';

export default function CameraScreen() {
  const [cameraType, setCameraType] = useState<'front' | 'back'>('back');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showButtons, setShowButtons] = useState(false); // 버튼 표시 여부 상태 추가
  const camera = useRef<Camera>(null);
  const device = useCameraDevice(cameraType);
  const {hasPermission, requestPermission} = useCameraPermission();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const takePhoto = async () => {
    if (camera.current == null) return;
    try {
      const photo = await camera.current.takePhoto();
      setCapturedPhoto(photo.path);

      // 버튼이 바로 보이지 않도록 지연 시간 설정
      setTimeout(() => {
        setShowButtons(true); // 일정 시간 후 버튼을 표시
      }, 500); // 0.5초 후 버튼을 보이도록 설정
    } catch (error) {
      console.error('📸 사진 촬영 실패:', error);
    }
  };

  const toggleCameraType = () => {
    setCameraType(prev => (prev === 'back' ? 'front' : 'back'));
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setShowButtons(false); // 버튼 숨기기
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      navigation.navigate('NewPost', {photo: capturedPhoto});
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>📷 카메라 권한이 필요합니다.</Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>📷 카메라를 찾는 중입니다...</Text>
      </View>
    );
  }

  // // 카메라 화면 비율
  // const format = useCameraFormat(device, []);

  // const aspectRatio = format?.videoAspectRatio ?? 4 / 3;

  // 사진이 찍힌 상태
  if (capturedPhoto) {
    return (
      <View style={styles.container}>
        {/* 사진 미리보기 */}
        <Image
          source={{uri: `file://${capturedPhoto}`}}
          style={styles.previewImage}
        />

        {showButtons && ( // showButtons가 true일 때만 버튼 표시
          <>
            <View style={styles.reButton}>
              <TouchableOpacity onPress={handleRetake}>
                <View style={{alignItems: 'center', gap: 3}}>
                  <CameraRevertIcon />
                  <Text style={styles.bottomText}>retake</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.uploadButton}>
              <TouchableOpacity onPress={handleConfirm}>
                <View style={{alignItems: 'center', gap: 3}}>
                  <CameraUploadIcon />
                  <Text style={styles.bottomText}>upload</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  }

  // 카메라 화면
  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
      />
      {/* 상단 X 버튼 */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          navigation.goBack();
        }}>
        <CameraCloseIcon />
      </TouchableOpacity>

      <TouchableOpacity style={styles.switchButton} onPress={toggleCameraType}>
        <CameraSwitchIcon />
      </TouchableOpacity>

      <TouchableOpacity style={styles.shutterButton} onPress={takePhoto}>
        <View style={styles.shutterInner} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'black'},
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  message: {color: 'white', fontSize: 16},

  // 카메라 화면
  camera: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  // 셔터 버튼
  shutterButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 10,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'transparent',
  },

  // 카메라 전환 버튼
  switchButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 25,
  },

  // X 버튼
  closeButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 25,
  },

  // 미리보기 이미지 (풀 화면)
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // 비율 맞추기 위해 'cover'로 설정
  },

  reButton: {
    position: 'absolute',
    bottom: 80,
    left: 60,
    // backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    position: 'absolute',
    bottom: 80,
    right: 60,
    // backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    color: 'white',
    fontSize: 14,
  },
});

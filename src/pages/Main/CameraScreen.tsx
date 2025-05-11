import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {useNavigation} from '@react-navigation/native'; // ← 네비게이션 추가
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/navigationTypes';

export default function CameraScreen() {
  const [cameraType, setCameraType] = useState<'front' | 'back'>('back');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null); // 사진 저장
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
      setCapturedPhoto(photo.path); // 촬영 후 상태 업데이트
    } catch (error) {
      console.error('📸 사진 촬영 실패:', error);
    }
  };

  const toggleCameraType = () => {
    setCameraType(prev => (prev === 'back' ? 'front' : 'back'));
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
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

  // 사진이 찍힌 상태
  if (capturedPhoto) {
    return (
      <View style={styles.container}>
        {/* 사진 미리보기 (1:1 비율) */}
        <Image
          source={{uri: `file://${capturedPhoto}`}}
          style={styles.previewImage}
        />

        {/* 상단 X 버튼 */}
        <TouchableOpacity style={styles.closeButton} onPress={handleRetake}>
          <Text style={styles.switchText}>✖</Text>
        </TouchableOpacity>

        {/* 하단 버튼 */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity onPress={handleRetake}>
            <Text style={styles.bottomText}>다시 찍기</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleConfirm}>
            <Text style={styles.bottomText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 카메라 화면
  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />

      <TouchableOpacity style={styles.switchButton} onPress={toggleCameraType}>
        <Text style={styles.switchText}>🔄</Text>
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

  // 셔터 버튼
  shutterButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000',
  },

  // 카메라 전환 버튼
  switchButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 10,
    borderRadius: 25,
  },
  switchText: {
    fontSize: 24,
    color: 'white',
  },

  // X 버튼
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 25,
  },

  // 미리보기 이미지 (1:1 비율)
  previewImage: {
    flex: 1,
    aspectRatio: 1,
    alignSelf: 'center',
    marginVertical: 20,
  },

  // 하단 버튼들
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  bottomText: {
    color: 'white',
    fontSize: 18,
  },
});

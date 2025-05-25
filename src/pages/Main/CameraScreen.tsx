import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
  PanResponder,
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

// 플래시 아이콘은 텍스트로 대체

export default function CameraScreen() {
  const [cameraType, setCameraType] = useState<'front' | 'back'>('back');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showButtons, setShowButtons] = useState(false);
  const [zoom, setZoom] = useState(1); // 줌 레벨 상태 추가
  const [isZooming, setIsZooming] = useState(false); // 줌 중인지 상태
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off'); // 플래시 모드 상태 추가

  const camera = useRef<Camera>(null);
  const device = useCameraDevice(cameraType);
  const {hasPermission, requestPermission} = useCameraPermission();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // 핀치 줌을 위한 ref들
  const pinchState = useRef<{
    initialDistance: number | null;
    initialZoom: number | null;
  }>({initialDistance: null, initialZoom: null});

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  // 핀치 제스처 처리를 위한 PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: event => {
        // 두 손가락 터치일 때만 반응
        return event.nativeEvent.touches.length === 2;
      },
      onMoveShouldSetPanResponder: event => {
        // 두 손가락 터치일 때만 반응
        return event.nativeEvent.touches.length === 2;
      },
      onStartShouldSetPanResponderCapture: () => false, // 다른 터치 이벤트 방해하지 않기
      onMoveShouldSetPanResponderCapture: event => {
        // 두 손가락일 때만 capture
        return event.nativeEvent.touches.length === 2;
      },
      onPanResponderGrant: event => {
        if (event.nativeEvent.touches.length === 2) {
          setIsZooming(true);
          // 초기 핀치 상태 리셋
          pinchState.current.initialDistance = null;
          pinchState.current.initialZoom = null;
          console.log('=== PINCH START ===');
        }
      },
      onPanResponderMove: event => {
        const touches = event.nativeEvent.touches;

        if (touches.length === 2) {
          const touch1 = touches[0];
          const touch2 = touches[1];

          // 두 터치 포인트 간의 거리 계산
          const distance = Math.sqrt(
            Math.pow(touch2.pageX - touch1.pageX, 2) +
              Math.pow(touch2.pageY - touch1.pageY, 2),
          );

          // 초기 거리가 없으면 현재 거리를 초기 거리로 설정
          if (pinchState.current.initialDistance === null) {
            pinchState.current.initialDistance = distance;
            pinchState.current.initialZoom = zoom;
            return;
          }

          // 초기 줌 값이 없으면 return
          const initialZoom = pinchState.current.initialZoom;
          if (initialZoom === null) return;

          // 줌 비율 계산
          const scale = distance / pinchState.current.initialDistance;
          let newZoom = initialZoom * scale;

          // 줌 범위 제한 (디바이스에 따라 다를 수 있음)
          const minZoom = 1;
          const maxZoom = device?.neutralZoom
            ? Math.min(device.neutralZoom * 4, 10)
            : 5;

          newZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));

          console.log('=== CAMERA ZOOM ===');
          console.log('Distance:', distance);
          console.log('Scale:', scale);
          console.log('New zoom:', newZoom);

          setZoom(newZoom);
        }
      },
      onPanResponderRelease: event => {
        console.log('=== PINCH END ===');
        setIsZooming(false);
        // 핀치 상태 초기화
        pinchState.current.initialDistance = null;
        pinchState.current.initialZoom = null;
      },
      onPanResponderTerminate: () => {
        console.log('=== PINCH TERMINATE ===');
        setIsZooming(false);
        pinchState.current.initialDistance = null;
        pinchState.current.initialZoom = null;
      },
      onShouldBlockNativeResponder: () => false, // 네이티브 응답 차단하지 않기
    }),
  ).current;

  const takePhoto = async () => {
    if (camera.current == null) return;
    try {
      const photo = await camera.current.takePhoto({
        flash: flashMode, // 플래시 모드 적용
      });
      setCapturedPhoto(photo.path);

      // 버튼이 바로 보이지 않도록 지연 시간 설정
      setTimeout(() => {
        setShowButtons(true);
      }, 500);
    } catch (error) {
      console.error('📸 사진 촬영 실패:', error);
    }
  };

  const toggleCameraType = () => {
    setCameraType(prev => (prev === 'back' ? 'front' : 'back'));
    // 카메라 전환 시 줌 초기화
    setZoom(1);
  };

  // 플래시 모드 토글 함수
  const toggleFlashMode = () => {
    setFlashMode(prev => {
      switch (prev) {
        case 'off':
          return 'on';
        case 'on':
          return 'auto';
        case 'auto':
          return 'off';
        default:
          return 'off';
      }
    });
  };

  // 플래시 아이콘 스타일 (모드에 따라 다른 투명도)
  const getFlashButtonStyle = () => {
    return [
      styles.flashButton,
      {
        backgroundColor:
          flashMode === 'off'
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(255, 255, 255, 0.8)',
      },
    ];
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setShowButtons(false);
    // 재촬영 시 줌 초기화
    setZoom(1);
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
        {/* 사진 미리보기 */}
        <Image
          source={{uri: `file://${capturedPhoto}`}}
          style={styles.previewImage}
        />

        {showButtons && (
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
      <View style={styles.cameraContainer} {...panResponder.panHandlers}>
        <Camera
          ref={camera}
          style={styles.camera}
          device={device}
          isActive={true}
          photo={true}
          zoom={zoom} // 줌 레벨 적용
        />
      </View>

      {/* 줌 표시 (줌 중일 때만) */}
      {isZooming && (
        <View style={styles.zoomIndicator}>
          <Text style={styles.zoomText}>{zoom.toFixed(1)}x</Text>
        </View>
      )}

      {/* 상단 X 버튼 */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          navigation.goBack();
        }}>
        <CameraCloseIcon />
      </TouchableOpacity>

      {/* 카메라 전환 버튼 */}
      <TouchableOpacity style={styles.switchButton} onPress={toggleCameraType}>
        <CameraSwitchIcon />
      </TouchableOpacity>

      {/* 플래시 버튼 (카메라 전환 버튼 아래) */}
      <TouchableOpacity style={getFlashButtonStyle()} onPress={toggleFlashMode}>
        <Text style={styles.flashIconText}>⚡</Text>
        {/* 플래시 모드 표시 텍스트 */}
        {flashMode !== 'off' && (
          <View style={styles.flashModeIndicator}>
            <Text style={styles.flashModeText}>
              {flashMode === 'auto' ? 'A' : 'O'}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* 셔터 버튼 */}
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

  // 카메라 컨테이너 (제스처 감지용)
  cameraContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // 카메라 화면
  camera: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  // 줌 표시기
  zoomIndicator: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: -20, // 중앙 정렬을 위한 오프셋
  },
  zoomText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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

  // 플래시 버튼 (카메라 전환 버튼 아래)
  flashButton: {
    position: 'absolute',
    top: 120, // 카메라 전환 버튼(60) + 버튼 높이(50) + 간격(10)
    right: 20,
    padding: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 플래시 아이콘 텍스트 스타일
  flashIconText: {
    color: 'white',
    fontSize: 20,
  },
  flashModeIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashModeText: {
    color: 'black',
    fontSize: 10,
    fontWeight: 'bold',
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
    resizeMode: 'contain',
  },

  reButton: {
    position: 'absolute',
    bottom: 80,
    left: 60,
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

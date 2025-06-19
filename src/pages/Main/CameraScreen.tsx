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
import Video from 'react-native-video';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/navigationTypes';
import CameraSwitchIcon from '../../statics/icons/Camera/camera_switch.svg';
import CameraCloseIcon from '../../statics/icons/Camera/camera_close.svg';
import CameraUploadIcon from '../../statics/icons/Camera/camera_upload.svg';
import CameraRevertIcon from '../../statics/icons/Camera/camera_revert.svg';
import CameraFlashIcon from '../../statics/icons/Camera/camera_flash.svg';

export default function CameraScreen() {
  const [cameraType, setCameraType] = useState<'front' | 'back'>('back');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [capturedVideo, setCapturedVideo] = useState<string | null>(null);
  const [showButtons, setShowButtons] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');

  // 동영상 관련 상태
  const [recordingMode, setRecordingMode] = useState<'photo' | 'video'>(
    'photo',
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const camera = useRef<Camera>(null);
  const device = useCameraDevice(cameraType);
  const {hasPermission, requestPermission} = useCameraPermission();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // 녹화 타이머를 위한 ref
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // 녹화 시간 정리
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  // 핀치 제스처 처리를 위한 PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: event => {
        return event.nativeEvent.touches.length === 2;
      },
      onMoveShouldSetPanResponder: event => {
        return event.nativeEvent.touches.length === 2;
      },
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: event => {
        return event.nativeEvent.touches.length === 2;
      },
      onPanResponderGrant: event => {
        if (event.nativeEvent.touches.length === 2) {
          setIsZooming(true);
          pinchState.current.initialDistance = null;
          pinchState.current.initialZoom = null;
        }
      },
      onPanResponderMove: event => {
        const touches = event.nativeEvent.touches;

        if (touches.length === 2) {
          const touch1 = touches[0];
          const touch2 = touches[1];

          const distance = Math.sqrt(
            Math.pow(touch2.pageX - touch1.pageX, 2) +
              Math.pow(touch2.pageY - touch1.pageY, 2),
          );

          if (pinchState.current.initialDistance === null) {
            pinchState.current.initialDistance = distance;
            pinchState.current.initialZoom = zoom;
            return;
          }

          const initialZoom = pinchState.current.initialZoom;
          if (initialZoom === null) return;

          const scale = distance / pinchState.current.initialDistance;
          let newZoom = initialZoom * scale;

          const minZoom = 1;
          const maxZoom = device?.neutralZoom
            ? Math.min(device.neutralZoom * 4, 10)
            : 5;

          newZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
          setZoom(newZoom);
        }
      },
      onPanResponderRelease: () => {
        setIsZooming(false);
        pinchState.current.initialDistance = null;
        pinchState.current.initialZoom = null;
      },
      onPanResponderTerminate: () => {
        setIsZooming(false);
        pinchState.current.initialDistance = null;
        pinchState.current.initialZoom = null;
      },
      onShouldBlockNativeResponder: () => false,
    }),
  ).current;

  // 사진 촬영
  const takePhoto = async () => {
    if (camera.current == null) return;
    try {
      const photo = await camera.current.takePhoto({
        flash: flashMode,
      });
      setCapturedPhoto(photo.path);

      setTimeout(() => {
        setShowButtons(true);
      }, 500);
    } catch (error) {
      console.error('📸 사진 촬영 실패:', error);
    }
  };

  // 동영상 녹화 시작
  const startVideoRecording = async () => {
    if (camera.current == null) return;

    try {
      setIsRecording(true);
      setRecordingTime(0);

      // 녹화 시간 타이머 시작
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      await camera.current.startRecording({
        flash: flashMode === 'auto' ? 'on' : flashMode, // auto일 때는 on으로 변환
        onRecordingFinished: video => {
          console.log('🎥 동영상 녹화 완료:', video);
          setCapturedVideo(video.path);
          setTimeout(() => {
            setShowButtons(true);
          }, 500);
        },
        onRecordingError: error => {
          console.error('🎥 동영상 녹화 실패:', error);
          setIsRecording(false);
          setRecordingTime(0);
          if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
          }
        },
      });
    } catch (error) {
      console.error('🎥 동영상 녹화 시작 실패:', error);
      setIsRecording(false);
    }
  };

  // 동영상 녹화 중지
  const stopVideoRecording = async () => {
    if (camera.current == null) return;

    try {
      await camera.current.stopRecording();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    } catch (error) {
      console.error('🎥 동영상 녹화 중지 실패:', error);
    }
  };

  // 촬영/녹화 버튼 핸들러
  const handleCapturePress = () => {
    if (recordingMode === 'photo') {
      takePhoto();
    } else {
      if (isRecording) {
        stopVideoRecording();
      } else {
        startVideoRecording();
      }
    }
  };

  const toggleCameraType = () => {
    setCameraType(prev => (prev === 'back' ? 'front' : 'back'));
    setZoom(1);
  };

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

  // 모드 전환
  const toggleRecordingMode = () => {
    if (!isRecording) {
      setRecordingMode(prev => (prev === 'photo' ? 'video' : 'photo'));
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setCapturedVideo(null);
    setShowButtons(false);
    setZoom(1);
    setRecordingTime(0);
    setIsVideoPlaying(false);
  };

  const handleConfirm = () => {
    const mediaPath = capturedPhoto || capturedVideo;
    if (mediaPath) {
      if (capturedPhoto) {
        navigation.navigate('NewPost', {photo: capturedPhoto});
      } else if (capturedVideo) {
        navigation.navigate('NewPost', {video: capturedVideo});
      }
    }
  };

  // 녹화 시간을 분:초 형식으로 변환
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
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

  // 사진/동영상이 찍힌 상태
  if (capturedPhoto || capturedVideo) {
    return (
      <View style={styles.container}>
        {/* 미리보기 */}
        {capturedPhoto ? (
          <Image
            source={{uri: `file://${capturedPhoto}`}}
            style={styles.previewImage}
          />
        ) : capturedVideo ? (
          <View>
            <Video
              source={{uri: `file://${capturedVideo}`}}
              style={styles.previewImage}
              resizeMode="cover"
              repeat={true}
              muted={false}
              paused={!isVideoPlaying}
              onLoad={() => {
                console.log('Video loaded');
                setIsVideoPlaying(true);
              }}
              onError={error => {
                console.error('Video error:', error);
              }}
            />
            {/* 비디오 재생/일시정지 버튼 */}
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => setIsVideoPlaying(!isVideoPlaying)}>
              <Text style={styles.playButtonText}>
                {isVideoPlaying ? '⏸️' : '▶️'}
              </Text>
            </TouchableOpacity>
            {/* 녹화 시간 표시 */}
            <View style={styles.videoDuration}>
              <Text style={styles.videoDurationText}>
                {formatTime(recordingTime)}
              </Text>
            </View>
          </View>
        ) : null}

        {showButtons && (
          <>
            <View
              style={[
                styles.reButton,
                {top: 150 + (Dimensions.get('window').width * 4) / 3 + 20},
              ]}>
              <TouchableOpacity onPress={handleRetake}>
                <View style={{alignItems: 'center', gap: 3}}>
                  <CameraRevertIcon />
                  <Text style={styles.bottomText}>retake</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.uploadButton,
                {top: 150 + (Dimensions.get('window').width * 4) / 3 + 20},
              ]}>
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
          photo={recordingMode === 'photo'}
          video={recordingMode === 'video'}
          zoom={zoom}
        />
      </View>

      {/* 녹화 중 표시 */}
      {isRecording && (
        <View style={styles.recordingIndicator}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>
            REC {formatTime(recordingTime)}
          </Text>
        </View>
      )}

      {/* 줌 표시 */}
      {isZooming && (
        <View style={styles.zoomIndicator}>
          <Text style={styles.zoomText}>{zoom.toFixed(1)}x</Text>
        </View>
      )}

      {/* 상단 X 버튼 */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}>
        <CameraCloseIcon />
      </TouchableOpacity>

      {/* 카메라 전환 버튼 */}
      <TouchableOpacity style={styles.switchButton} onPress={toggleCameraType}>
        <CameraSwitchIcon />
      </TouchableOpacity>

      {/* 플래시 버튼 */}
      <TouchableOpacity style={styles.flashButton} onPress={toggleFlashMode}>
        <CameraFlashIcon />
        {flashMode !== 'off' && (
          <View style={styles.flashModeIndicator}>
            <Text style={styles.flashModeText}>
              {flashMode === 'auto' ? 'A' : 'O'}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* 모드 전환 버튼 (사진/동영상) */}
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            recordingMode === 'photo' && styles.modeButtonActive,
          ]}
          onPress={() => !isRecording && setRecordingMode('photo')}>
          <Text
            style={[
              styles.modeText,
              recordingMode === 'photo' && styles.modeTextActive,
            ]}>
            PHOTO
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            recordingMode === 'video' && styles.modeButtonActive,
          ]}
          onPress={() => !isRecording && setRecordingMode('video')}>
          <Text
            style={[
              styles.modeText,
              recordingMode === 'video' && styles.modeTextActive,
            ]}>
            VIDEO
          </Text>
        </TouchableOpacity>
      </View>

      {/* 셔터/녹화 버튼 */}
      <TouchableOpacity
        style={[styles.shutterButton, isRecording && styles.recordingButton]}
        onPress={handleCapturePress}>
        <View
          style={[
            styles.shutterInner,
            recordingMode === 'video' && styles.videoShutterInner,
            isRecording && styles.recordingInner,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  message: {color: 'white', fontSize: 16},
  container: {flex: 1, backgroundColor: 'black'},
  cameraContainer: {
    flex: 1,
    width: '100%',
    marginTop: 150,
  },
  camera: {
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').width * 4) / 3,
  },

  // 녹화 중 표시
  recordingIndicator: {
    position: 'absolute',
    top: 170,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginRight: 8,
  },
  recordingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  zoomIndicator: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: -20,
  },
  zoomText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // 모드 선택기
  modeSelector: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 4,
  },
  modeButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modeButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  modeText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modeTextActive: {
    color: 'black',
  },

  // 셔터/녹화 버튼
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
  recordingButton: {
    borderColor: '#ff4444',
  },
  shutterInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'transparent',
  },
  videoShutterInner: {
    backgroundColor: '#ff4444',
  },
  recordingInner: {
    backgroundColor: '#ff4444',
    borderRadius: 8, // 사각형 모양으로 변경
  },

  switchButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    // backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 25,
  },
  flashButton: {
    position: 'absolute',
    top: 120,
    right: 20,
    padding: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  closeButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    // backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 25,
  },

  // 미리보기
  previewImage: {
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').width * 4) / 3,
    marginTop: 150,
    resizeMode: 'cover',
    backgroundColor: '#000',
    position: 'relative', // 추가: 내부 요소들의 절대 위치 기준
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -25}, {translateY: -25}],
    marginTop: 75,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 20,
  },
  videoDuration: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  videoDurationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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

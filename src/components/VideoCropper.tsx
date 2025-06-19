// components/VideoCropper.tsx
import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  PanResponder,
  Animated,
} from 'react-native';
import Video from 'react-native-video';

interface VideoCropperProps {
  video: string;
}

const {width: screenWidth} = Dimensions.get('window');
const CONTAINER_HEIGHT = (screenWidth * 4) / 3; // 4:3 비율

export const VideoCropper: React.FC<VideoCropperProps> = ({video}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);

  // 애니메이션 값들
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 제스처 관련 - 현재 스케일 값 추적
  const [isGesturing, setIsGesturing] = useState(false);
  const [currentScale, setCurrentScale] = useState(1);
  const gestureState = useRef({
    initialDistance: 0,
    initialScale: 1,
  });

  // 컨트롤 자동 숨김 타이머
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 핀치 줌 제스처 처리
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: evt => evt.nativeEvent.touches.length === 2,
      onMoveShouldSetPanResponder: evt => evt.nativeEvent.touches.length === 2,

      onPanResponderGrant: evt => {
        if (evt.nativeEvent.touches.length === 2) {
          setIsGesturing(true);
          const touch1 = evt.nativeEvent.touches[0];
          const touch2 = evt.nativeEvent.touches[1];

          const distance = Math.sqrt(
            Math.pow(touch2.pageX - touch1.pageX, 2) +
              Math.pow(touch2.pageY - touch1.pageY, 2),
          );

          gestureState.current.initialDistance = distance;
          gestureState.current.initialScale = currentScale;
        }
      },

      onPanResponderMove: evt => {
        if (evt.nativeEvent.touches.length === 2) {
          const touch1 = evt.nativeEvent.touches[0];
          const touch2 = evt.nativeEvent.touches[1];

          const distance = Math.sqrt(
            Math.pow(touch2.pageX - touch1.pageX, 2) +
              Math.pow(touch2.pageY - touch1.pageY, 2),
          );

          const scale =
            (distance / gestureState.current.initialDistance) *
            gestureState.current.initialScale;
          const clampedScale = Math.max(0.5, Math.min(3, scale));

          setCurrentScale(clampedScale);
          scaleAnim.setValue(clampedScale);
        }
      },

      onPanResponderRelease: () => {
        setIsGesturing(false);
      },
    }),
  ).current;

  // 시간 포맷팅 함수
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  // 컨트롤 표시/숨김
  const showControlsTemporarily = () => {
    setShowControls(true);

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // 화면 터치 핸들러
  const handleScreenPress = () => {
    if (showControls) {
      setShowControls(false);
    } else {
      showControlsTemporarily();
    }
  };

  // 재생/일시정지 토글
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      showControlsTemporarily();
    }
  };

  // 볼륨 토글
  const toggleVolume = () => {
    setVolume(volume > 0 ? 0 : 1);
  };

  // 비디오 로드 완료
  const onLoad = (data: any) => {
    setDuration(data.duration);
    showControlsTemporarily();
  };

  // 재생 시간 업데이트
  const onProgress = (data: any) => {
    setCurrentTime(data.currentTime);
  };

  // 진행바 터치 핸들러 (간단한 버전)
  const handleProgressBarPress = (evt: any) => {
    const x = evt.nativeEvent.locationX;
    const progressBarWidth = screenWidth - 120; // 여백 제외
    const newTime = (x / progressBarWidth) * duration;
    // 실제로는 video ref를 통해 seek 기능 구현 필요
    console.log('Seek to:', newTime);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.videoContainer}
        activeOpacity={1}
        onPress={handleScreenPress}
        {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.videoWrapper,
            {
              transform: [{scale: scaleAnim}],
            },
          ]}>
          <Video
            source={{uri: `file://${video}`}}
            style={styles.video}
            resizeMode="cover"
            repeat={false}
            paused={!isPlaying}
            volume={volume}
            onLoad={onLoad}
            onProgress={onProgress}
            onEnd={() => setIsPlaying(false)}
          />
        </Animated.View>

        {/* 제스처 중 스케일 표시 */}
        {isGesturing && (
          <View style={styles.scaleIndicator}>
            <Text style={styles.scaleText}>{currentScale.toFixed(1)}x</Text>
          </View>
        )}

        {/* 비디오 컨트롤 오버레이 */}
        {showControls && (
          <Animated.View
            style={[
              styles.controlsOverlay,
              {
                opacity: fadeAnim,
              },
            ]}>
            {/* 중앙 재생/일시정지 버튼 */}
            <TouchableOpacity
              style={styles.playPauseButton}
              onPress={togglePlayPause}>
              <Text style={styles.playPauseText}>
                {isPlaying ? '⏸️' : '▶️'}
              </Text>
            </TouchableOpacity>

            {/* 하단 컨트롤바 */}
            <View style={styles.bottomControls}>
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>

              {/* 진행바 */}
              <TouchableOpacity
                style={styles.progressBarContainer}
                onPress={handleProgressBarPress}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width:
                          duration > 0
                            ? `${(currentTime / duration) * 100}%`
                            : '0%',
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>

              <Text style={styles.timeText}>{formatTime(duration)}</Text>

              {/* 볼륨 버튼 */}
              <TouchableOpacity
                style={styles.volumeButton}
                onPress={toggleVolume}>
                <Text style={styles.volumeText}>
                  {volume > 0 ? '🔊' : '🔇'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </TouchableOpacity>

      {/* 비디오 정보 */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>📹 Video • {formatTime(duration)}</Text>
        <Text style={styles.infoSubtext}>
          Tap to show/hide controls • Pinch to zoom
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    backgroundColor: '#000',
    marginHorizontal: -16, // NewPost의 padding 상쇄
  },
  videoContainer: {
    width: screenWidth,
    height: CONTAINER_HEIGHT,
    backgroundColor: '#000',
    position: 'relative',
    overflow: 'hidden',
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
  },

  // 제스처 관련
  scaleIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  scaleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // 컨트롤 오버레이
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 중앙 재생 버튼
  playPauseButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 'auto',
    marginTop: 'auto',
  },
  playPauseText: {
    fontSize: 24,
  },

  // 하단 컨트롤
  bottomControls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    minWidth: 40,
  },

  // 진행바
  progressBarContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1FA1FF',
    borderRadius: 2,
  },

  // 볼륨 버튼
  volumeButton: {
    marginLeft: 10,
  },
  volumeText: {
    fontSize: 16,
  },

  // 정보 영역
  infoContainer: {
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  infoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#666',
  },
});

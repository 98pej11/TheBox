import React, {useRef, useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';

interface ImageCropperProps {
  photo?: string; // optional로 변경
  onGestureStart?: () => void;
  onGestureEnd?: () => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  photo,
  onGestureStart,
  onGestureEnd,
}) => {
  // photo가 없으면 에러 처리
  if (!photo) {
    return (
      <View style={styles.cropContainer}>
        <View style={styles.imageContainer}>
          <Text style={styles.errorText}>이미지가 없습니다.</Text>
        </View>
      </View>
    );
  }

  const [scale] = useState(new Animated.Value(1));
  const [translateX] = useState(new Animated.Value(0));
  const [translateY] = useState(new Animated.Value(0));

  const [currentScale, setCurrentScale] = useState(1);
  const [currentTranslateX, setCurrentTranslateX] = useState(0);
  const [currentTranslateY, setCurrentTranslateY] = useState(0);

  const pinchRef = useRef({
    initialDistance: 0,
    initialScale: 1,
    lastScale: 1,
    lastTranslateX: 0,
    lastTranslateY: 0,
  });

  // scale 값이 변경될 때마다 lastScale 동기화
  React.useEffect(() => {
    pinchRef.current.lastScale = currentScale;
  }, [currentScale]);

  // translate 값이 변경될 때마다 동기화
  React.useEffect(() => {
    pinchRef.current.lastTranslateX = currentTranslateX;
    pinchRef.current.lastTranslateY = currentTranslateY;
  }, [currentTranslateX, currentTranslateY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: event => {
        return event.nativeEvent.touches.length === 2;
      },
      onMoveShouldSetPanResponder: event => {
        return event.nativeEvent.touches.length === 2;
      },
      onStartShouldSetPanResponderCapture: event => {
        return event.nativeEvent.touches.length === 2;
      },
      onMoveShouldSetPanResponderCapture: event => {
        return event.nativeEvent.touches.length === 2;
      },
      onPanResponderGrant: event => {
        const touches = event.nativeEvent.touches;
        if (touches.length === 2) {
          onGestureStart?.(); // 부모에게 제스처 시작 알림
          const distance = getDistance(touches[0], touches[1]);
          pinchRef.current.initialDistance = distance;
          pinchRef.current.initialScale = currentScale;
          pinchRef.current.lastScale = currentScale;
          pinchRef.current.lastTranslateX = currentTranslateX;
          pinchRef.current.lastTranslateY = currentTranslateY;
        }
      },
      onPanResponderMove: (event, gestureState) => {
        const touches = event.nativeEvent.touches;
        if (touches.length === 2) {
          const distance = getDistance(touches[0], touches[1]);
          const scaleRatio = distance / pinchRef.current.initialDistance;
          const newScale = Math.max(
            0.5,
            Math.min(3, pinchRef.current.initialScale * scaleRatio),
          );

          setCurrentScale(newScale);
          scale.setValue(newScale);
        } else if (touches.length === 1 && currentScale > 1) {
          // 단일 터치로 이동 (줌이 되어있을 때만) - gestureState 사용
          const newTranslateX =
            pinchRef.current.lastTranslateX + gestureState.dx;
          const newTranslateY =
            pinchRef.current.lastTranslateY + gestureState.dy;

          setCurrentTranslateX(newTranslateX);
          setCurrentTranslateY(newTranslateY);
          translateX.setValue(newTranslateX);
          translateY.setValue(newTranslateY);
        }
      },
      onPanResponderRelease: () => {
        onGestureEnd?.(); // 부모에게 제스처 종료 알림
        // 아무것도 하지 않음 - 값들은 이미 실시간으로 업데이트됨
      },
      onPanResponderTerminate: () => {
        onGestureEnd?.(); // 부모에게 제스처 종료 알림
      },
      onShouldBlockNativeResponder: () => true, // 네이티브 제스처 차단
    }),
  ).current;

  const getDistance = (touch1: any, touch2: any) => {
    const dx = touch1.pageX - touch2.pageX;
    const dy = touch1.pageY - touch2.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  return (
    <View style={styles.cropContainer}>
      <View style={styles.imageContainer} {...panResponder.panHandlers}>
        <Animated.Image
          source={{uri: 'file://' + photo}}
          style={[
            styles.image,
            {
              transform: [
                {translateX: translateX},
                {translateY: translateY},
                {scale: scale},
              ],
            },
          ]}
          resizeMode="cover"
        />
      </View>

      {/* 줌 레벨 표시 */}
      {currentScale !== 1 && (
        <View style={styles.cropGuide}>
          <Text style={styles.cropGuideText}>{currentScale.toFixed(1)}x</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cropContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imageContainer: {
    width: Dimensions.get('window').width - 32, // 좌우 패딩 16씩 제외
    height: ((Dimensions.get('window').width - 32) * 4) / 3, // 4:3 비율
    alignSelf: 'center',
    overflow: 'hidden', // 이미지가 컨테이너 밖으로 나가지 않도록
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cropGuide: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cropGuideText: {
    color: '#fff',
    fontSize: 12,
  },
  errorText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
});

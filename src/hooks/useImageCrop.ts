import {useState, useRef} from 'react';
import {PanResponder, Dimensions} from 'react-native';

const {width: screenWidth} = Dimensions.get('window');
const cropSize = screenWidth - 32;

export const useImageCrop = () => {
  const [imagePosition, setImagePosition] = useState({x: 0, y: 0});
  const [imageSize, setImageSize] = useState({
    width: cropSize * 1.5,
    height: cropSize * 1.5,
  });
  const [imageScale, setImageScale] = useState(1);
  const [originalImageSize, setOriginalImageSize] = useState({
    width: 0,
    height: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  const currentPosition = useRef({x: 0, y: 0});
  const currentScale = useRef(1);
  const dragStartPosition = useRef({x: 0, y: 0});
  const pinchState = useRef<{
    initialDistance: number | null;
    initialScale: number | null;
  }>({initialDistance: null, initialScale: null});

  const onImageLoad = (event: any) => {
    const {width, height} = event.nativeEvent.source;
    const aspectRatio = width / height;

    let displayWidth, displayHeight;

    if (aspectRatio < 1) {
      displayWidth = cropSize;
      displayHeight = displayWidth / aspectRatio;
    } else {
      displayHeight = cropSize;
      displayWidth = displayHeight * aspectRatio;
    }

    setOriginalImageSize({width: displayWidth, height: displayHeight});
    setImageSize({width: displayWidth, height: displayHeight});

    let initialX, initialY;

    if (displayWidth <= cropSize) {
      initialX = (cropSize - displayWidth) / 2;
    } else {
      initialX = -(displayWidth - cropSize) / 2;
    }

    if (displayHeight <= cropSize) {
      initialY = (cropSize - displayHeight) / 2;
    } else {
      initialY = -(displayHeight - cropSize) / 2;
    }

    setImagePosition({x: initialX, y: initialY});
    setImageScale(1);
    currentPosition.current = {x: initialX, y: initialY};
    currentScale.current = 1;
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: event => {
        return event.nativeEvent.touches.length <= 2;
      },
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (event, gestureState) => {
        setIsDragging(true);
        dragStartPosition.current = {
          x: currentPosition.current.x,
          y: currentPosition.current.y,
        };
      },
      onPanResponderMove: (event, gestureState) => {
        const touches = event.nativeEvent.touches;

        if (touches.length === 2) {
          // 핀치 줌 로직
          const touch1 = touches[0];
          const touch2 = touches[1];

          const distance = Math.sqrt(
            Math.pow(touch2.pageX - touch1.pageX, 2) +
              Math.pow(touch2.pageY - touch1.pageY, 2),
          );

          if (pinchState.current.initialDistance === null) {
            pinchState.current.initialDistance = distance;
            pinchState.current.initialScale = currentScale.current;
            return;
          }

          const initialScale = pinchState.current.initialScale;
          if (initialScale === null) return;

          const scale =
            (distance / pinchState.current.initialDistance) * initialScale;
          const minScale = Math.max(
            cropSize / originalImageSize.width,
            cropSize / originalImageSize.height,
          );
          const maxScale = 3;
          const limitedScale = Math.max(minScale, Math.min(maxScale, scale));

          const newWidth = originalImageSize.width * limitedScale;
          const newHeight = originalImageSize.height * limitedScale;

          setImageScale(limitedScale);
          setImageSize({width: newWidth, height: newHeight});
          currentScale.current = limitedScale;

          // 위치 조정 로직...
        } else if (touches.length === 1) {
          // 드래그 로직
          const {dx, dy} = gestureState;
          const currentWidth = imageSize.width;
          const currentHeight = imageSize.height;

          let minX, maxX, minY, maxY;

          if (currentWidth <= cropSize) {
            const centerX = (cropSize - currentWidth) / 2;
            minX = maxX = centerX;
          } else {
            maxX = -10;
            minX = -(currentWidth - cropSize) + 180;
          }

          if (currentHeight <= cropSize) {
            const centerY = (cropSize - currentHeight) / 2;
            minY = maxY = centerY;
          } else {
            maxY = 0;
            minY = -(currentHeight - cropSize) - 100;
          }

          const targetX = dragStartPosition.current.x + dx;
          const targetY = dragStartPosition.current.y + dy;
          const newX = Math.max(minX, Math.min(maxX, targetX));
          const newY = Math.max(minY, Math.min(maxY, targetY));

          currentPosition.current = {x: newX, y: newY};
          setImagePosition({x: newX, y: newY});
        }
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        pinchState.current.initialDistance = null;
        pinchState.current.initialScale = null;
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        pinchState.current.initialDistance = null;
        pinchState.current.initialScale = null;
      },
    }),
  ).current;

  return {
    imagePosition,
    imageSize,
    imageScale,
    isDragging,
    onImageLoad,
    panResponder,
    cropSize,
  };
};

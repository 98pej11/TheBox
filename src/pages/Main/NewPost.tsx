import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../types/navigationTypes';
import {friendsStore} from '../../stores/friendsStore';

type NewPostRouteProp = RouteProp<RootStackParamList, 'NewPost'>;

const {width: screenWidth} = Dimensions.get('window');
const cropSize = screenWidth - 32; // padding 16 * 2

export default function NewPost() {
  const route = useRoute<NewPostRouteProp>();
  const navigation = useNavigation();
  const {photo} = route.params;

  const [text, setText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<
    'category' | 'mention' | 'location' | null
  >(null);

  // 이미지 위치 조정을 위한 state
  const [imagePosition, setImagePosition] = useState({x: 0, y: 0});
  const [imageSize, setImageSize] = useState({
    width: cropSize * 1.5,
    height: cropSize * 1.5,
  }); // 임시로 크기 설정
  const [imageScale, setImageScale] = useState(1); // 줌 스케일 추가
  const [originalImageSize, setOriginalImageSize] = useState({
    width: 0,
    height: 0,
  }); // 원본 크기 저장
  const [isDragging, setIsDragging] = useState(false);
  const currentPosition = useRef({x: 0, y: 0}); // 현재 위치를 추적하는 ref
  const currentScale = useRef(1); // 현재 스케일을 추적하는 ref
  const dragStartPosition = useRef({x: 0, y: 0});
  const pinchState = useRef<{
    initialDistance: number | null;
    initialScale: number | null;
  }>({initialDistance: null, initialScale: null}); // 핀치 상태 관리
  const scrollViewRef = useRef<any>(null);

  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: string[];
  }>({
    category: [],
    mention: [],
    location: [],
  });

  const [tempSelected, setTempSelected] = useState<string[]>([]);

  useEffect(() => {
    friendsStore.fetchFriendList();
  }, []);

  // modalData를 동적으로 생성 - friendStore의 friendList 사용
  const getModalData = () => {
    const friendNames =
      friendsStore.friendList?.map(
        friend => friend.lastName + friend.firstName,
      ) || [];

    return {
      category: ['가족', '여행', '음식', '기념일', '기타'],
      mention: friendNames, // friendStore에서 가져온 친구 이름들
      location: ['서울', '부산', '제주'],
    };
  };

  const openModal = (type: 'category' | 'mention' | 'location') => {
    setModalType(type);
    // 안전하게 초기화 - 배열이 아니면 빈 배열로 설정
    const currentSelected = selectedItems[type];
    setTempSelected(Array.isArray(currentSelected) ? currentSelected : []);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const confirmModal = () => {
    if (modalType) {
      setSelectedItems(prev => ({...prev, [modalType]: tempSelected}));
    }
    setModalVisible(false);
  };

  const cancelModal = () => {
    setTempSelected([]);
    setModalVisible(false);
  };

  const toggleItemSelection = (item: string) => {
    setTempSelected(prev => {
      // prev가 배열이 아니면 빈 배열로 초기화
      const currentArray = Array.isArray(prev) ? prev : [];
      return currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item];
    });
  };

  const handleConfirm = () => {
    console.log('작성한 글:', text);
    console.log('선택된 친구들:', selectedItems.mention);
    navigation.goBack();
  };

  // 이미지 로드 완료 시 크기 계산
  const onImageLoad = (event: any) => {
    const {width, height} = event.nativeEvent.source;
    const aspectRatio = width / height;

    let displayWidth, displayHeight;

    // 크롭 영역을 완전히 채우도록 계산 (더 큰 쪽에 맞춤)
    if (aspectRatio < 1) {
      // 세로가 더 긴 경우 (9:16) - 가로를 크롭 사이즈에 맞추고 세로는 비례해서 확대
      displayWidth = cropSize;
      displayHeight = displayWidth / aspectRatio;
    } else {
      // 가로가 더 긴 경우 - 세로를 크롭 사이즈에 맞추고 가로는 비례해서 확대
      displayHeight = cropSize;
      displayWidth = displayHeight * aspectRatio;
    }

    console.log('=== IMAGE LOAD ===');
    console.log('Original size:', {width, height});
    console.log('Aspect ratio:', aspectRatio);
    console.log('Display size:', {width: displayWidth, height: displayHeight});
    console.log('Crop size:', cropSize);

    // 원본 크기와 초기 디스플레이 크기 저장
    setOriginalImageSize({width: displayWidth, height: displayHeight});
    setImageSize({width: displayWidth, height: displayHeight});

    // 초기 위치 계산 - 이미지 크기에 따라 달리 설정
    let initialX, initialY;

    // X축 초기 위치
    if (displayWidth <= cropSize) {
      // 이미지가 작으면 중앙에 위치
      initialX = (cropSize - displayWidth) / 2;
    } else {
      // 이미지가 크면 중앙에서 시작 (양쪽으로 동일하게 잘림)
      initialX = -(displayWidth - cropSize) / 2;
    }

    // Y축 초기 위치
    if (displayHeight <= cropSize) {
      // 이미지가 작으면 중앙에 위치
      initialY = (cropSize - displayHeight) / 2;
    } else {
      // 이미지가 크면 위쪽에서 시작 (아래쪽도 볼 수 있도록)
      initialY = 0; // 이미지 위쪽이 크롭 영역 위쪽과 맞게 시작
    }

    // X축 초기 위치
    if (displayWidth <= cropSize) {
      // 이미지가 작으면 중앙에 위치
      initialX = (cropSize - displayWidth) / 2;
    } else {
      // 이미지가 크면 중앙에서 시작 (양쪽으로 동일하게 잘림)
      initialX = -(displayWidth - cropSize) / 2;
    }

    // Y축 초기 위치
    if (displayHeight <= cropSize) {
      // 이미지가 작으면 중앙에 위치
      initialY = (cropSize - displayHeight) / 2;
    } else {
      // 이미지가 크면 중앙에서 시작 (위아래로 동일하게 잘림)
      initialY = -(displayHeight - cropSize) / 2;
    }

    console.log('=== INITIAL POSITION CALCULATION ===');
    console.log('Display size:', {width: displayWidth, height: displayHeight});
    console.log('Crop size:', cropSize);
    console.log('Initial position:', {x: initialX, y: initialY});

    setImagePosition({x: initialX, y: initialY});
    setImageScale(1); // 초기 스케일 설정
    currentPosition.current = {x: initialX, y: initialY}; // ref 초기화
    currentScale.current = 1; // 스케일 ref 초기화
  };

  // PanResponder 설정 - 드래그와 핀치 줌 지원
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: event => {
        // 터치가 2개면 핀치 줌, 1개면 드래그
        return event.nativeEvent.touches.length <= 2;
      },
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (event, gestureState) => {
        setIsDragging(true);
        // 현재 위치를 드래그 시작 위치로 저장 (ref에서 가져오기)
        dragStartPosition.current = {
          x: currentPosition.current.x,
          y: currentPosition.current.y,
        };
        console.log('=== GESTURE START ===');
        console.log('Touches:', event.nativeEvent.touches.length);
        console.log('Current position from ref:', currentPosition.current);
        console.log('Current scale:', currentScale.current);
      },
      onPanResponderMove: (event, gestureState) => {
        const touches = event.nativeEvent.touches;

        if (touches.length === 2) {
          // 핀치 줌 처리
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
            pinchState.current.initialScale = currentScale.current;
            return;
          }

          // 스케일 계산 (null 체크 후)
          const initialScale = pinchState.current.initialScale;
          if (initialScale === null) return;

          const scale =
            (distance / pinchState.current.initialDistance) * initialScale;

          // 최소 스케일 제한 (원본 크기보다 작아지지 않도록)
          const minScale = Math.max(
            cropSize / originalImageSize.width,
            cropSize / originalImageSize.height,
          );

          // 최대 스케일 제한 (3배까지)
          const maxScale = 3;

          const limitedScale = Math.max(minScale, Math.min(maxScale, scale));

          console.log('=== PINCH ZOOM ===');
          console.log('Distance:', distance);
          console.log('Scale:', scale);
          console.log('Limited scale:', limitedScale);
          console.log('Min scale:', minScale);
          console.log('Max scale:', maxScale);

          // 새로운 이미지 크기 계산
          const newWidth = originalImageSize.width * limitedScale;
          const newHeight = originalImageSize.height * limitedScale;

          setImageScale(limitedScale);
          setImageSize({width: newWidth, height: newHeight});
          currentScale.current = limitedScale;

          // 줌 후 위치 조정 - 현재 위치를 유지하면서 경계만 체크
          let adjustedX = currentPosition.current.x;
          let adjustedY = currentPosition.current.y;

          // 새로운 크기에 대한 경계 계산
          let minX, maxX, minY, maxY;

          // X축 경계
          if (newWidth <= cropSize) {
            const centerX = (cropSize - newWidth) / 2;
            minX = maxX = centerX;
            adjustedX = centerX; // 이미지가 작아지면 중앙으로
          } else {
            maxX = 0;
            minX = -(newWidth - cropSize);
            // 현재 위치가 경계를 벗어나지 않도록 조정
            adjustedX = Math.max(minX, Math.min(maxX, adjustedX));
          }

          // Y축 경계
          if (newHeight <= cropSize) {
            const centerY = (cropSize - newHeight) / 2;
            minY = maxY = centerY;
            adjustedY = centerY; // 이미지가 작아지면 중앙으로
          } else {
            maxY = 0;
            minY = -(newHeight - cropSize) - 100;
            // 현재 위치가 경계를 벗어나지 않도록 조정
            adjustedY = Math.max(minY, Math.min(maxY, adjustedY));
          }

          console.log('Zoom position adjustment:', {
            oldPosition: currentPosition.current,
            newImageSize: {width: newWidth, height: newHeight},
            boundaries: {minX, maxX, minY, maxY},
            adjustedPosition: {x: adjustedX, y: adjustedY},
          });

          // 조정된 위치 적용
          if (
            adjustedX !== currentPosition.current.x ||
            adjustedY !== currentPosition.current.y
          ) {
            setImagePosition({x: adjustedX, y: adjustedY});
            currentPosition.current = {x: adjustedX, y: adjustedY};
          }
        } else if (touches.length === 1) {
          // 단일 터치 드래그 처리 (기존 코드)
          const {dx, dy} = gestureState;

          // 현재 이미지 크기 사용 (스케일은 이미 imageSize에 반영됨)
          const currentWidth = imageSize.width;
          const currentHeight = imageSize.height;

          console.log('=== DRAG DEBUG ===');
          console.log('Current image size:', {
            width: currentWidth,
            height: currentHeight,
          });
          console.log('Crop size:', cropSize);
          console.log('Current position:', currentPosition.current);
          console.log('Drag start:', dragStartPosition.current);
          console.log('Gesture dy:', dy);

          // 경계 계산
          let minX, maxX, minY, maxY;

          // X축 경계 계산
          if (currentWidth <= cropSize) {
            const centerX = (cropSize - currentWidth) / 2;
            minX = maxX = centerX;
          } else {
            maxX = -10;
            minX = -(currentWidth - cropSize) + 180;
          }

          // Y축 경계 계산 - 전체 이미지를 볼 수 있도록 수정
          if (currentHeight <= cropSize) {
            const centerY = (cropSize - currentHeight) / 2;
            minY = maxY = centerY;
            console.log('Y축: 이미지가 작음, 중앙 고정:', centerY);
          } else {
            // 이미지 전체를 충분히 볼 수 있도록 여유를 둔 경계 설정
            maxY = 0; // 위쪽으로 50px 여유
            minY = -(currentHeight - cropSize) - 100; // 아래쪽으로도 50px 여유

            console.log('Y축 경계 계산:');
            console.log('  이미지 높이:', currentHeight);
            console.log('  크롭 높이:', cropSize);
            console.log('  넘치는 부분:', currentHeight - cropSize);
            console.log('  maxY (위쪽 한계) - 이미지 위쪽 끝:', maxY);
            console.log('  minY (아래쪽 한계) - 이미지 아래쪽 끝:', minY);
            console.log('  전체 이동 가능 범위:', maxY - minY);
            console.log(
              '  설명: Y=0일 때 이미지 위쪽, Y=' + minY + '일 때 이미지 아래쪽',
            );
          }

          // 드래그하려는 새 위치 계산
          const targetX = dragStartPosition.current.x + dx;
          const targetY = dragStartPosition.current.y + dy;

          // 경계 내에서만 이동하도록 제한
          const newX = Math.max(minX, Math.min(maxX, targetX));
          const newY = Math.max(minY, Math.min(maxY, targetY));

          console.log('Drag calculation:', {
            gestureY: dy,
            dragStartY: dragStartPosition.current.y,
            targetY: targetY,
            boundaries: {minY, maxY},
            finalY: newY,
            wasLimitedY: targetY !== newY,
            canMoveUp: targetY < dragStartPosition.current.y,
            canMoveDown: targetY > dragStartPosition.current.y,
            hitTopBoundary: newY === maxY,
            hitBottomBoundary: newY === minY,
          });

          // ref와 state 모두 업데이트
          currentPosition.current = {x: newX, y: newY};
          setImagePosition({x: newX, y: newY});
        }
      },
      onPanResponderRelease: (event, gestureState) => {
        setIsDragging(false);
        // 핀치 줌 초기화
        pinchState.current.initialDistance = null;
        pinchState.current.initialScale = null;
        console.log('=== GESTURE END ===');
        console.log('Final position:', currentPosition.current);
        console.log('Final scale:', currentScale.current);
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        pinchState.current.initialDistance = null;
        pinchState.current.initialScale = null;
      },
    }),
  ).current;

  return (
    <KeyboardAwareScrollView
      ref={scrollViewRef}
      style={{flex: 1, backgroundColor: '#fff'}}
      contentContainerStyle={styles.scrollContainer}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      keyboardOpeningTime={0}
      extraScrollHeight={150}
      scrollEnabled={!isDragging}
      keyboardShouldPersistTaps="handled">
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => openModal('category')}>
        <Text>🔖</Text>
        <Text style={styles.iconLabel}>
          {selectedItems.category.length > 0
            ? selectedItems.category.join(', ')
            : 'Category'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => openModal('mention')}>
        <Text>👤</Text>
        <Text style={styles.iconLabel}>
          {selectedItems.mention.length > 0
            ? selectedItems.mention.join(', ')
            : 'Mention'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => openModal('location')}>
        <Text>📍</Text>
        <Text style={styles.iconLabel}>
          {selectedItems.location.length > 0
            ? selectedItems.location.join(', ')
            : 'Location'}
        </Text>
      </TouchableOpacity>

      <View style={styles.imageWrapper}>
        <View style={styles.cropContainer}>
          <View style={styles.imageContainer} {...panResponder.panHandlers}>
            <Image
              source={{uri: 'file://' + photo}}
              style={[
                styles.image,
                {
                  width: imageSize.width,
                  height: imageSize.height,
                  transform: [
                    {translateX: imagePosition.x},
                    {translateY: imagePosition.y},
                    // scale 제거 - imageSize에 이미 스케일이 반영됨
                  ],
                },
              ]}
              onLoad={onImageLoad}
              resizeMode="cover"
            />
          </View>

          {/* 크롭 가이드 텍스트 */}
          <View style={styles.cropGuide}>
            <Text style={styles.cropGuideText}>드래그해서 위치 조정</Text>
          </View>
        </View>
      </View>

      <TextInput
        style={styles.textInput}
        placeholder="add the content..."
        placeholderTextColor="#888"
        multiline
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Upload</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {modalType &&
                getModalData()[modalType].map((item, index) => {
                  const isSelected = Array.isArray(tempSelected)
                    ? tempSelected.includes(item)
                    : false;
                  const isLast = index === getModalData()[modalType].length - 1;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.modelItem,
                        isLast && {borderBottomWidth: 0},
                      ]}
                      onPress={() => toggleItemSelection(item)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: 16,
                        }}>
                        <Text style={{marginRight: 10}}>
                          {isSelected ? '✅' : ''}
                        </Text>
                        <Text style={styles.modalText}>{item}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </View>

            <View style={[styles.modalContent, {marginBottom: 100}]}>
              <TouchableOpacity style={styles.modelItem} onPress={confirmModal}>
                <Text style={[styles.modalText, {color: '#008000'}]}>
                  confirm
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modelItem && {borderBottomWidth: 0}]}
                onPress={cancelModal}>
                <Text style={[styles.modalText, {color: '#ff0000'}]}>
                  cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  imageWrapper: {
    paddingVertical: 8,
    overflow: 'hidden',
  },
  cropContainer: {
    width: cropSize,
    height: cropSize,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
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
  textInput: {
    marginTop: 16,
    height: 120,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  confirmButton: {
    position: 'absolute',
    bottom: 80,
    backgroundColor: '#1FA1FF',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 60,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  iconButton: {
    flexDirection: 'row',
    // alignItems: 'center',
    marginLeft: 8,
    marginBottom: 12,
  },
  iconLabel: {
    fontSize: 13,
    marginLeft: 10,
    color: '#4b4b4b',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 15,
  },
  modelItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#cdcccc',
  },
});

// NewPost.tsx - 사진/동영상 지원하는 메인 컴포넌트
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../types/navigationTypes';
import {friendsStore} from '../../stores/friendsStore';
import {putFileUpload} from '../../apis/putFileUpload';

// 분리된 컴포넌트들 import
import {ImageCropper} from '../../components/ImageCropper';
import {VideoCropper} from '../../components/VideoCropper'; // 새로 추가
import {SelectionButtons} from '../../components/SelectionButtons';
import {SelectionModal} from '../../components/SelectionModal';

// 커스텀 훅 import
import {useModal} from '../../hooks/useModal';
import {useImageCrop} from '../../hooks/useImageCrop';

// 유틸리티 함수 import
import {getMimeTypeFromPath, generateFileName} from '../../utils/fileUtils';
import {StackNavigationProp} from '@react-navigation/stack';
import {uploadImageToS3} from '../../utils/uploadUtils';
import {postUpload, getContentType} from '../../apis/postUpload';
import axios from 'axios';
import {LocationModal} from '../../components/LocationModal';

type NewPostRouteProp = RouteProp<RootStackParamList, 'NewPost'>;

export default function NewPost() {
  const route = useRoute<NewPostRouteProp>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // photo 또는 video 파라미터 받기
  const {photo, video} = route.params;

  // 미디어 파일 경로와 타입 결정
  const mediaPath = photo || video;
  const isVideo = !!video;

  // mediaPath가 없으면 에러 처리
  if (!mediaPath) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>미디어 파일이 없습니다.</Text>
      </View>
    );
  }

  const [text, setText] = useState('');
  const scrollViewRef = useRef<any>(null);

  // 커스텀 훅 사용
  const {isDragging} = useImageCrop();
  const {
    modalVisible,
    modalType,
    selectedItems,
    tempCategory,
    tempMention,
    tempLocation,
    openModal,
    closeModal,
    confirmModal,
    cancelModal,
    toggleCategorySelection,
    toggleMentionSelection,
    setLocationData,
  } = useModal();

  useEffect(() => {
    friendsStore.fetchFriendList();
  }, []);

  const [isImageGesturing, setIsImageGesturing] = useState(false);

  const handleImageGestureStart = () => {
    setIsImageGesturing(true);
  };

  const handleImageGestureEnd = () => {
    setIsImageGesturing(false);
  };

  const handleConfirm = async () => {
    try {
      console.log('=== 게시물 업로드 시작 ===');
      console.log('미디어 타입:', isVideo ? 'VIDEO' : 'PHOTO');
      console.log('미디어 경로:', mediaPath);

      // 1. 파일 정보 생성
      const mimeType = getMimeTypeFromPath(mediaPath!); // 타입 단언 추가
      const fileName = generateFileName(mimeType);
      const fileSize = 1024 * 1024; // 실제 파일 크기로 변경 권장

      console.log('파일 정보:', {fileName, fileSize, mimeType});

      // 2. Pre-signed URL 요청
      console.log('=== 1단계: Pre-signed URL 요청 ===');
      const result = await putFileUpload(fileName, fileSize, mimeType);

      if (!result || !result.filePath || !result.preSignedUrl) {
        throw new Error('Pre-signed URL 요청 실패');
      }

      const {filePath, preSignedUrl} = result;
      console.log('Pre-signed URL 응답:', {filePath, preSignedUrl});

      // 3. S3에 미디어 파일 업로드
      console.log(
        `=== 2단계: S3에 ${isVideo ? '동영상' : '이미지'} 업로드 ===`,
      );

      if (!mediaPath) {
        throw new Error('미디어 파일 URI가 없습니다');
      }

      const fetchResponse = await fetch(`file://${mediaPath}`);
      const blob = await fetchResponse.blob();

      await axios.put(preSignedUrl, blob, {
        headers: {
          'Content-Type': mimeType,
          'Content-Length': fileSize.toString(),
        },
      });

      console.log('S3 업로드 성공');

      // 4. 게시물 데이터 준비
      console.log('=== 3단계: 게시물 데이터 준비 ===');
      console.log('filePath:', filePath);
      console.log('mimeType:', mimeType);
      console.log('contentType will be:', getContentType(mimeType));

      // content는 필수 필드 - 명시적으로 생성
      const contentData = {
        contentType: getContentType(mimeType), // 'IMAGE' 또는 'VIDEO'
        contentUrl: filePath, // S3에 업로드된 파일 경로
      };

      console.log('content 객체:', JSON.stringify(contentData, null, 2));

      // 기본 postData 구조
      const postData: any = {
        content: contentData, // content 필드는 반드시 포함
      };

      console.log(
        '기본 postData (content만):',
        JSON.stringify(postData, null, 2),
      );

      // 옵션 필드들 - 값이 있을 때만 추가
      if (text && text.trim() !== '') {
        postData.text = text.trim();
        console.log('text 추가됨:', postData.text);
      }

      if (selectedItems.mention && selectedItems.mention.length > 0) {
        postData.tagIds = selectedItems.mention;
        console.log('tagIds 추가됨:', postData.tagIds);
      }

      if (selectedItems.category && selectedItems.category.length > 0) {
        postData.categories = selectedItems.category;
        console.log('categories 추가됨:', postData.categories);
      }

      console.log('=== 최종 전송할 게시물 데이터 ===');
      console.log(JSON.stringify(postData, null, 2));

      // 5. 게시물 생성 API 호출
      console.log('=== 4단계: 게시물 생성 API 호출 ===');

      const uploadResult = await postUpload(postData);
      console.log('게시물 생성 성공:', uploadResult);

      // 6. 성공 시 화면 이동
      navigation.navigate('AllPosts');
    } catch (error) {
      console.error('업로드 실패:', error);
    }
  };

  return (
    <KeyboardAwareScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      keyboardOpeningTime={0}
      extraScrollHeight={150}
      scrollEnabled={!isDragging && !isImageGesturing}
      keyboardShouldPersistTaps="handled">
      <SelectionButtons selectedItems={selectedItems} onOpenModal={openModal} />

      {/* 미디어 타입에 따라 다른 컴포넌트 렌더링 */}
      {isVideo ? (
        <VideoCropper video={mediaPath!} />
      ) : (
        <ImageCropper photo={mediaPath!} />
      )}

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

      {modalType === 'category' && (
        <SelectionModal
          visible={modalVisible}
          modalType={modalType}
          tempSelected={tempCategory}
          onClose={closeModal}
          onConfirm={confirmModal}
          onCancel={cancelModal}
          onToggleItem={
            toggleCategorySelection as (item: string | number) => void
          }
        />
      )}

      {modalType === 'mention' && (
        <SelectionModal
          visible={modalVisible}
          modalType={modalType}
          tempSelected={tempMention}
          onClose={closeModal}
          onConfirm={confirmModal}
          onCancel={cancelModal}
          onToggleItem={
            toggleMentionSelection as (item: string | number) => void
          }
        />
      )}

      {modalType === 'location' && (
        <LocationModal
          visible={modalVisible}
          tempSelected={
            tempLocation.length > 0
              ? tempLocation[0]
              : {
                  locationName: '',
                  latitude: 0,
                  longitude: 0,
                }
          }
          onClose={closeModal}
          onConfirm={confirmModal}
          onCancel={cancelModal}
          onToggleItem={setLocationData}
        />
      )}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
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
  errorText: {
    color: '#ff0000',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});

// NewPost.tsx - 리팩토링된 메인 컴포넌트
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
import {SelectionButtons} from '../../components/SelectionButtons';
import {SelectionModal} from '../../components/SelectionModal';

// 커스텀 훅 import
import {useModal} from '../../hooks/useModal';
import {useImageCrop} from '../../hooks/useImageCrop';

// 유틸리티 함수 import
import {getMimeTypeFromPath, generateFileName} from '../../utils/fileUtils';
import {StackNavigationProp} from '@react-navigation/stack';
import {uploadImageToS3} from '../../utils/uploadUtils';
import {postUpload} from '../../apis/postUpload';

type NewPostRouteProp = RouteProp<RootStackParamList, 'NewPost'>;

export default function NewPost() {
  const route = useRoute<NewPostRouteProp>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {photo} = route.params;

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

  const handleConfirm = async () => {
    try {
      console.log('작성한 글:', text);
      console.log('선택된 친구들:', selectedItems.mention);
      console.log('선택된 카테고리:', selectedItems.category);
      console.log('선택된 위치:', selectedItems.location);

      // 파일 정보 생성
      const mimeType = getMimeTypeFromPath(photo);
      const fileName = generateFileName(mimeType);
      const fileSize = 1024 * 1024; // 실제 파일 크기로 변경 권장

      // 유틸 함수 사용해서 S3에 이미지 업로드
      const filePath = await uploadImageToS3(
        photo, // 이미지 URI
        fileName,
        fileSize,
        mimeType,
        mimeType, // 또는 'POST_IMAGE'
        putFileUpload,
      );

      console.log('이미지 업로드 성공:', filePath);

      // 데이터로 한번 감싸야되나?
      const request = {
        contentUrl: filePath,
        // location: selectedItems.location,
        text: text,
        tagIds: selectedItems.mention,
        categories: selectedItems.category,
      };

      const result = await postUpload(request);
      console.log('게시물 생성 성공:', result);

      // 성공 시 AllPosts 화면으로 이동
      navigation.navigate('AllPosts');
    } catch (error) {
      console.error('업로드 실패:', error);
      // 에러 처리 (Alert 등)
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
      scrollEnabled={!isDragging}
      keyboardShouldPersistTaps="handled">
      <SelectionButtons selectedItems={selectedItems} onOpenModal={openModal} />

      <ImageCropper photo={photo} />

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
        <SelectionModal
          visible={modalVisible}
          modalType={modalType}
          tempSelected={tempLocation}
          onClose={closeModal}
          onConfirm={confirmModal}
          onCancel={cancelModal}
          onToggleItem={setLocationData as any}
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
});

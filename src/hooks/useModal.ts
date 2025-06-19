import {useState} from 'react';

interface SelectedItems {
  category: string[];
  mention: number[];
  location: {
    locationName: string;
    latitude: number;
    longitude: number;
  }[]; // 배열로 변경
}

export const useModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<
    'category' | 'mention' | 'location' | null
  >(null);

  // 최종 선택된 아이템들
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    category: [],
    mention: [],
    location: [], // 빈 배열로 초기화
  });

  // 각 타입별로 임시 선택 상태 분리
  const [tempCategory, setTempCategory] = useState<string[]>([]);
  const [tempMention, setTempMention] = useState<number[]>([]);
  const [tempLocation, setTempLocation] = useState<
    {
      locationName: string;
      latitude: number;
      longitude: number;
    }[]
  >([]); // 배열로 변경

  // 모달 열기
  const openModal = (type: 'category' | 'mention' | 'location') => {
    setModalType(type);

    // 현재 선택된 값들을 임시 상태에 복사
    switch (type) {
      case 'category':
        setTempCategory([...selectedItems.category]);
        break;
      case 'mention':
        setTempMention([...selectedItems.mention]);
        break;
      case 'location':
        setTempLocation([...selectedItems.location]); // 배열 복사
        break;
    }

    setModalVisible(true);
  };

  // 모달 닫기 (변경사항 취소)
  const closeModal = () => {
    setModalVisible(false);
    // 임시 상태들 초기화
    setTempCategory([]);
    setTempMention([]);
    setTempLocation([]); // 빈 배열로 초기화
  };

  // 모달 확인 (변경사항 적용)
  const confirmModal = () => {
    if (modalType) {
      switch (modalType) {
        case 'category':
          setSelectedItems(prev => ({...prev, category: tempCategory}));
          break;
        case 'mention':
          setSelectedItems(prev => ({...prev, mention: tempMention}));
          break;
        case 'location':
          setSelectedItems(prev => ({...prev, location: tempLocation}));
          break;
      }
    }
    setModalVisible(false);
  };

  // 모달 취소 (변경사항 취소)
  const cancelModal = () => {
    // 임시 상태들 초기화
    setTempCategory([]);
    setTempMention([]);
    setTempLocation([]); // 빈 배열로 초기화
    setModalVisible(false);
  };

  // 카테고리 선택/해제
  const toggleCategorySelection = (item: string) => {
    setTempCategory(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item],
    );
  };

  // 멘션(친구) 선택/해제
  const toggleMentionSelection = (item: number) => {
    setTempMention(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item],
    );
  };

  // 위치 설정 - 단일 위치를 배열에 저장
  const setLocationData = (locationData: {
    locationName: string;
    latitude: number;
    longitude: number;
  }) => {
    setTempLocation([locationData]); // 단일 객체를 배열로 래핑
  };

  // 현재 모달 타입에 따른 임시 선택된 데이터 반환
  const getCurrentTempSelected = () => {
    switch (modalType) {
      case 'category':
        return tempCategory;
      case 'mention':
        return tempMention;
      case 'location':
        return tempLocation;
      default:
        return [];
    }
  };

  return {
    // 상태
    modalVisible,
    modalType,
    selectedItems,

    // 임시 상태들
    tempCategory,
    tempMention,
    tempLocation,

    // 모달 제어 함수들
    openModal,
    closeModal,
    confirmModal,
    cancelModal,

    // 선택 토글 함수들
    toggleCategorySelection,
    toggleMentionSelection,
    setLocationData,

    // 유틸리티 함수
    getCurrentTempSelected,
  };
};

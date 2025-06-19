import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import {getModalData} from '../statics/data/modalData';

interface SelectionModalProps {
  visible: boolean;
  modalType: 'category' | 'mention' | 'location' | null;
  tempSelected:
    | string[]
    | number[]
    | {locationName: string; latitude: number; longitude: number};
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  onToggleItem: (item: string | number) => void;
}

export const SelectionModal: React.FC<SelectionModalProps> = ({
  visible,
  modalType,
  tempSelected,
  onClose,
  onConfirm,
  onCancel,
  onToggleItem,
}) => {
  // 선택 여부 확인 함수
  const isItemSelected = (item: any): boolean => {
    if (!Array.isArray(tempSelected)) {
      return false; // location 객체인 경우
    }

    if (modalType === 'category') {
      // category는 문자열 배열
      return (tempSelected as string[]).includes(item);
    } else if (modalType === 'mention') {
      // mention은 숫자 배열 (친구 ID들)
      const friendId = typeof item === 'object' ? item.id : item;
      return (tempSelected as number[]).includes(friendId);
    } else if (modalType === 'location') {
      // location은 문자열 배열
      return (tempSelected as string[]).includes(item);
    }

    return false;
  };

  // 아이템 클릭 핸들러
  const handleItemPress = (item: any) => {
    if (modalType === 'mention' && typeof item === 'object') {
      // mention인 경우 친구 ID를 전달
      onToggleItem(item.id);
    } else {
      // category, location인 경우 아이템 자체를 전달
      onToggleItem(item);
    }
  };

  // 아이템 표시 텍스트 가져오기
  const getDisplayText = (item: any): string => {
    if (modalType === 'mention' && typeof item === 'object') {
      return item.name; // 친구 이름 표시
    }
    return item; // 문자열인 경우 그대로 표시
  };

  // 모달 데이터 렌더링
  const renderModalItems = () => {
    if (!modalType) return null;

    const modalData = getModalData()[modalType];
    if (!modalData) return null;

    return modalData.map((item, index) => {
      const isSelected = isItemSelected(item);
      const isLast = index === modalData.length - 1;
      const displayText = getDisplayText(item);

      return (
        <TouchableOpacity
          key={index}
          style={[styles.modelItem, isLast && {borderBottomWidth: 0}]}
          onPress={() => handleItemPress(item)}>
          <View style={styles.modalItemContainer}>
            <Text style={styles.checkmark}>{isSelected ? '✅' : ''}</Text>
            <Text style={styles.modalText}>{displayText}</Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>{renderModalItems()}</View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[styles.modalContent, {marginBottom: 100}]}>
              <TouchableOpacity style={styles.modelItem} onPress={onConfirm}>
                <Text style={[styles.modalText, {color: '#008000'}]}>
                  confirm
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modelItem, {borderBottomWidth: 0}]}
                onPress={onCancel}>
                <Text style={[styles.modalText, {color: '#ff0000'}]}>
                  cancel
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  modalItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  checkmark: {
    marginRight: 10,
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

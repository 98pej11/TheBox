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
  const isItemSelected = (item: string | number): boolean => {
    if (Array.isArray(tempSelected)) {
      // modalType에 따라 타입 안전하게 체크
      if (modalType === 'category' && typeof item === 'string') {
        return (tempSelected as string[]).includes(item);
      } else if (modalType === 'mention' && typeof item === 'number') {
        return (tempSelected as number[]).includes(item);
      } else if (modalType === 'mention' && typeof item === 'string') {
        // mention에서 문자열이 들어온 경우 숫자로 변환해서 체크
        const numericItem = parseInt(item, 10);
        return (
          !isNaN(numericItem) &&
          (tempSelected as number[]).includes(numericItem)
        );
      } else if (modalType === 'category' && typeof item === 'number') {
        // category에서 숫자가 들어온 경우 문자열로 변환해서 체크
        return (tempSelected as string[]).includes(item.toString());
      }
    }
    return false; // location 객체인 경우 또는 타입이 맞지 않는 경우
  };

  // 아이템 클릭 핸들러
  const handleItemPress = (item: string | number) => {
    // modalType에 따라 적절한 타입으로 변환
    if (modalType === 'mention') {
      // mention인 경우 숫자로 변환
      const numericItem = typeof item === 'string' ? parseInt(item, 10) : item;
      if (!isNaN(numericItem)) {
        onToggleItem(numericItem);
      }
    } else {
      // category인 경우 문자열로 사용
      onToggleItem(item);
    }
  };

  // 모달 데이터 렌더링
  const renderModalItems = () => {
    if (!modalType) return null;

    const modalData = getModalData()[modalType];
    if (!modalData) return null;

    return modalData.map((item, index) => {
      const isSelected = isItemSelected(item);
      const isLast = index === modalData.length - 1;

      return (
        <TouchableOpacity
          key={index}
          style={[styles.modelItem, isLast && {borderBottomWidth: 0}]}
          onPress={() => handleItemPress(item)}>
          <View style={styles.modalItemContainer}>
            <Text style={styles.checkmark}>{isSelected ? '✅' : ''}</Text>
            <Text style={styles.modalText}>{item}</Text>
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

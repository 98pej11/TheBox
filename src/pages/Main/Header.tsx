import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import CameraIcon from '../../statics/icons/semi_camera.svg';
import MenuIcon from '../../statics/icons/menu.svg'; // 같은 방식으로 아이콘 가져오기
import UserIcon from '../../statics/icons/menu_user.svg'; // 계정 관리 아이콘 예시
import LogoutIcon from '../../statics/icons/menu_logout.svg'; // 로그아웃 아이콘 예시

const Header = () => {
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태 관리

  // 모달을 열 때
  const openModal = () => {
    setModalVisible(true);
  };

  // 모달을 닫을 때
  const closeModal = () => {
    setModalVisible(false);
  };

  // 로그아웃 클릭 시
  const handleLogout = () => {
    console.log('로그아웃 클릭');
    // 로그아웃 처리 코드 추가
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {/* <Text style={styles.nickname}>eunjung</Text> */}
      </View>
      <View style={styles.rightContainer}>
        {/* 오른쪽에는 두 개의 아이콘 */}
        <TouchableOpacity style={styles.iconButton}>
          <CameraIcon width={25} height={25} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={openModal}>
          <MenuIcon width={25} height={25} />
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent1}>
              <TouchableOpacity style={styles.menuItem}>
                <UserIcon width={20} height={20} />
                <Text style={styles.modalText}>계정 관리</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
                <LogoutIcon width={20} height={20} />
                <Text style={[styles.modalText, {color: '#ff0000'}]}>
                  로그아웃
                </Text>
              </TouchableOpacity>
              {/* 메뉴 내용 추가 가능 */}
            </View>
            <View style={styles.modalContent2}>
              <TouchableOpacity onPress={closeModal}>
                <Text style={[styles.modalText, {color: '#ff0000'}]}>
                  cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 왼쪽, 오른쪽으로 배치
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 20, // 아이콘 간의 간격
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent1: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginHorizontal: 20,
    marginBottom: 20, // 하단에서 떨어지도록 추가
  },
  modalContent2: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginHorizontal: 20,
    marginBottom: 100, // 하단에서 떨어지도록 추가
  },
  menuItem: {
    flexDirection: 'row', // 아이콘과 텍스트를 가로로 배치
    alignItems: 'center', // 수직 가운데 정렬
    gap: 15,
    marginLeft: 25,
    // paddingVertical: 10, // 패딩 추가
  },
  modalText: {
    fontSize: 17,
    fontWeight: 'regular',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default Header;

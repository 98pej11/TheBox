import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
} from 'react-native';
import Footer from './Footer';
import SearchIcon from '../../statics/icons/search.svg';
import XIcon from '../../statics/icons/x.svg';
import SendIcon from '../../statics/icons/send_friend.svg'; // 전송 아이콘
import DeleteIcon from '../../statics/icons/delete_friend.svg'; // 삭제 아이콘

// Define the type for each friend object
interface Friend {
  id: string;
  name: string;
  imageUrl: string;
}

export default function Friends() {
  const [searchText, setSearchText] = useState(''); // 입력값을 관리하는 상태

  const handleClearText = () => {
    setSearchText(''); // 입력값 초기화
  };

  const friendsData = [
    {
      id: '1',
      name: 'John Doe',
      imageUrl: 'https://randomuser.me/api/portraits/men/10.jpg',
    },
    {
      id: '2',
      name: 'Jane Smith',
      imageUrl: 'https://randomuser.me/api/portraits/women/5.jpg',
    },
    {
      id: '3',
      name: 'Sam Wilson',
      imageUrl: 'https://randomuser.me/api/portraits/men/20.jpg',
    },
    // 추가 친구 데이터
  ];

  const renderFriendItem = ({item}: {item: Friend}) => (
    <View style={styles.friendItem}>
      <Image source={{uri: item.imageUrl}} style={styles.profileImage} />
      <Text style={styles.friendName}>{item.name}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={() => handleSend(item.id)}
          style={styles.iconButton}>
          <SendIcon width={22} height={22} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.iconButton}>
          <DeleteIcon width={22} height={22} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleSend = (id: any) => {
    console.log('Send to', id);
  };

  const handleDelete = (id: any) => {
    console.log('Delete friend with ID:', id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          {/* 왼쪽에 search 아이콘 */}
          <SearchIcon width={20} height={20} color="#888" />
        </View>
        <TextInput
          style={styles.input}
          placeholder="search your friend"
          placeholderTextColor="#888" // placeholder 텍스트 색상
          value={searchText} // 상태값을 입력에 연결
          onChangeText={setSearchText} // 입력값 변경 시 상태 업데이트
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            style={styles.clearIconContainer}
            onPress={handleClearText}>
            <XIcon width={15} height={15} color="#888" />
          </TouchableOpacity>
        )}
      </View>
      <View>
        <Text style={styles.listTitle}>Your Friends (3/20)</Text>
        <FlatList
          data={friendsData}
          renderItem={renderFriendItem}
          keyExtractor={item => item.id}
        />
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  inputContainer: {
    padding: 30,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center', // 수평 정렬
  },
  iconContainer: {
    position: 'absolute', // 아이콘을 텍스트 왼쪽에 고정
    left: 40, // 왼쪽 여백 (paddingLeft보다 조금 더 큰 값을 설정)
    zIndex: 1, // 아이콘이 다른 요소들 위에 오도록 설정
  },
  input: {
    height: 40,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    paddingLeft: 50, // 아이콘을 피하기 위해 텍스트의 왼쪽 여백을 더 추가
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
  },
  clearIconContainer: {
    position: 'absolute',
    right: 40, // 오른쪽 여백
    zIndex: 2,
  },
  listTitle: {
    fontSize: 18,
    padding: 20,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  friendName: {
    fontSize: 16,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 30, // 오른쪽 여백
  },
  iconButton: {
    marginLeft: 10,
  },
});

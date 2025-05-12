import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import Footer from './Footer';
import SearchIcon from '../../statics/icons/search.svg';
import XIcon from '../../statics/icons/x.svg';
import SendIcon from '../../statics/icons/send_friend.svg'; // 전송 아이콘
import DeleteIcon from '../../statics/icons/delete_friend.svg'; // 삭제 아이콘
import {friendsStore} from '../../stores/friendsStore';
import {observer} from 'mobx-react-lite';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/navigationTypes';
import {Friend} from '../../types/friendTypes';

export default observer(function FriendList() {
  const [searchText, setSearchText] = useState(''); // 입력값을 관리하는 상태
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>(
    friendsStore.friendList,
  ); // 필터링된 친구 목록

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    friendsStore.fetchFriendList();
  }, []);

  useEffect(() => {
    if (searchText === '') {
      setFilteredFriends(friendsStore.friendList); // 검색 텍스트가 비어있으면 전체 목록 표시
    } else {
      setFilteredFriends(
        friendsStore.friendList.filter(friend =>
          `${friend.lastName} ${friend.firstName}`
            .toLowerCase()
            .includes(searchText.toLowerCase()),
        ),
      );
    }
  }, [searchText, friendsStore.friendList]);

  const handleClearText = () => {
    setSearchText(''); // 입력값 초기화
  };

  const renderFriendItem = ({item}: {item: Friend}) => (
    <View style={styles.friendItem}>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => {
          friendsStore.fetchFriendProfile(item.id).then(() => {
            navigation.navigate('FriendFeed', {id: item.id});
          });
        }}>
        <Image source={{uri: item.imageUrl}} style={styles.profileImage} />
        <Text style={styles.friendName}>
          {item.lastName} {item.firstName}
        </Text>
      </TouchableOpacity>
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

  const handleDelete = (id: number) => {
    Alert.alert(
      '친구 삭제',
      '정말 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          onPress: () => {
            console.log('Delete friend:', id);
            friendsStore.deleteFriend(id);
          },
        },
      ],
      {cancelable: true},
    );
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
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
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
        <Text style={styles.listTitle}>
          Your Friends ({filteredFriends.length}/{friendsStore.friendCount})
        </Text>
        <FlatList
          data={filteredFriends} // 필터링된 목록을 FlatList에 전달
          renderItem={renderFriendItem}
        />
      </View>
      <Footer />
    </View>
  );
});

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

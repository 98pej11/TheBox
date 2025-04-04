import React, {useState, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import postStore from '../../stores/postStore';
import MyPostIcon from '../../statics/icons/my_post.svg';
import MentionPostIcon from '../../statics/icons/mention_post.svg';

interface Post {
  id: number;
  text: string;
  content?: {
    contentType: string;
    contentUrl: string;
  };
}

export default observer(function PostList() {
  const [activeTab, setActiveTab] = useState('my_page');

  useEffect(() => {
    postStore.fetchPosts(activeTab);
  }, [activeTab]);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
  };

  const renderItem = ({item}: {item: Post}) => (
    <View style={styles.postItem}>
      <Text style={styles.postText}>{item.text}</Text>
      {item.content && (
        <View style={styles.postContent}>
          <Text>Type: {item.content.contentType}</Text>
          <Text>{item.content.contentUrl}</Text>
        </View>
      )}
    </View>
  );
  return (
    <View style={styles.container}>
      {/* 탭 네비게이션 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my_page' && styles.activeTab]}
          onPress={() => handleTabPress('my_page')}>
          <MyPostIcon width={20} height={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'mentioned' && styles.activeTab]}
          onPress={() => handleTabPress('mentioned')}>
          <MentionPostIcon width={20} height={20} />
        </TouchableOpacity>
      </View>

      {/* 포스트 목록 */}
      <View style={styles.content}>
        {postStore.isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : postStore.error ? (
          <Text style={styles.errorText}>오류 발생: {postStore.error}</Text>
        ) : postStore.posts.length === 0 ? (
          <Text style={styles.emptyMessage}>게시물이 없습니다.</Text>
        ) : (
          <FlatList
            data={postStore.posts}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={styles.columnWrapper}
            ListEmptyComponent={
              <Text style={styles.emptyMessage}>게시물이 없습니다.</Text>
            }
          />
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 1,
    borderBottomColor: '#606060',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  postItem: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 10,
    marginRight: 10,
  },
  postText: {
    fontSize: 16,
    marginBottom: 6,
  },
  postContent: {
    marginTop: 6,
    padding: 8,
    backgroundColor: '#f7f7f7',
    borderRadius: 4,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666666',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

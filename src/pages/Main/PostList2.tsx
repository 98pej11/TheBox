import React, {useState, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import postStore from '../../stores/postStore';
import MyPostIcon from '../../statics/icons/my_post.svg';
import MentionPostIcon from '../../statics/icons/mention_post.svg';
import {accountStore} from '../../stores/accountStore';

interface Post {
  id: number;
  text: string;
  content?: {
    contentType: string;
    contentUrl: string;
  };
}

type Props = {
  userId: number;
};

export default observer(function PostList2({userId}: Props) {
  useEffect(() => {
    if (accountStore.accessToken) {
      console.log(userId);
      postStore.fetchFriendPosts(userId);
    }
  }, [accountStore.accessToken]);

  const renderItem = ({item}: {item: Post}) =>
    item.content?.contentUrl ? (
      <View style={styles.imageContainer}>
        <Image
          source={{uri: item.content.contentUrl}}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    ) : null;

  return (
    <View style={styles.container}>
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
    paddingVertical: 20,
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
  imageContainer: {
    flex: 1,
    aspectRatio: 1, // 정사각형
    margin: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
});

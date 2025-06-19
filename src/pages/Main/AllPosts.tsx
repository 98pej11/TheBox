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
  Dimensions,
  SafeAreaView,
} from 'react-native';
import postStore from '../../stores/postStore';
import {Post} from '../../types/postTypes';
import LogoIcon from '../../statics/icons/Feed/logo.svg';
import NoticeIcon from '../../statics/icons/Feed/notice.svg';
import SearchIcon from '../../statics/icons/Feed/search.svg';
import Footer from './Footer';

const {width} = Dimensions.get('window');

export default observer(function AllPosts() {
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    postStore.fetchAllPosts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await postStore.fetchAllPosts();
    setRefreshing(false);
  };

  const loadMore = () => {
    if (postStore.next && !postStore.isLoadingMore) {
      postStore.fetchMoreAllPosts();
    }
  };

  const renderPost = ({item}: {item: Post}) => (
    <View style={styles.postContainer}>
      {/* 사용자 정보 헤더 */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.userId.toString().charAt(0)}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.username}>User {item.userId}</Text>
            <Text style={styles.postMeta}>
              {item.content.date} {'>'} {item.content.time} {'>'}{' '}
              {item.categories.join(', ')}
            </Text>
          </View>
        </View>
      </View>

      {/* 텍스트 내용 */}
      {item.text && <Text style={styles.postText}>{item.text}</Text>}

      {/* 콘텐츠 이미지/비디오 */}
      {item.content.contentUrl && (
        <View style={styles.contentContainer}>
          {item.content.contentType === 'image' ? (
            <Image
              source={{uri: item.content.contentUrl}}
              style={styles.contentImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoText}>Video Content</Text>
            </View>
          )}
        </View>
      )}

      {/* 위치 정보 */}
      {item.location.locationName && (
        <Text style={styles.location}>📍 {item.location.locationName}</Text>
      )}

      {/* 인터랙션 버튼들 */}
      <View style={styles.interactionContainer}>
        <View style={styles.reactionButton}>
          <Text style={styles.reactionEmoji}>❤️</Text>
          <Text style={styles.reactionEmoji}>😊</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputPlaceholder}>send message....</Text>
        </View>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!postStore.isLoadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#666" />
      </View>
    );
  };

  if (postStore.isLoading && !postStore.posts.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <LogoIcon />
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <SearchIcon />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <NoticeIcon />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={postStore.posts}
        renderItem={renderPost}
        keyExtractor={item => item.id.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
      <Footer />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 10,
    padding: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContainer: {
    backgroundColor: '#fff',
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E1E1E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  postMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  postText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 12,
    lineHeight: 20,
  },
  contentContainer: {
    marginBottom: 12,
  },
  contentImage: {
    width: width - 32,
    height: ((width - 32) * 4) / 3,
    borderRadius: 8,
  },
  videoPlaceholder: {
    width: width - 32,
    height: ((width - 32) * 4) / 3,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    fontSize: 16,
    color: '#666',
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  interactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  reactionButton: {
    flexDirection: 'row',
    marginRight: 12,
  },
  reactionEmoji: {
    fontSize: 20,
    marginRight: 4,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputPlaceholder: {
    color: '#999',
    fontSize: 14,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

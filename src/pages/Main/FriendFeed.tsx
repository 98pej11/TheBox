import React, {useEffect} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import Footer from './Footer';
import Header from './Header';
import Profile from './FriendProfile';
// import {friendsStore} from '../../stores/friendsStore';
import PostList2 from './PostList2';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../types/navigationTypes';

type FriendFeedRouteProp = RouteProp<RootStackParamList, 'FriendFeed'>;

export default function FriendFeed() {
  const route = useRoute<FriendFeedRouteProp>();
  const {id} = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Profile />
      <PostList2 userId={id} />
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // 전체 화면을 채우도록 설정
    justifyContent: 'flex-start', // 기본적인 내용 배치를 위로 설정 (기본값이므로 선택사항)
    backgroundColor: '#fff',
  },
});

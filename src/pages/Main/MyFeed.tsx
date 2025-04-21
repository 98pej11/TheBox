import React, {useEffect} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import Footer from './Footer';
import Header from './Header';
import Profile from './MyProfile';
import PostList from './PostList';
import {observer} from 'mobx-react-lite';
import {accountStore} from '../../stores/accountStore';

export default observer(function MyFeed() {
  useEffect(() => {
    if (accountStore.accessToken) {
      accountStore.fetchMyProfile();
    }
  }, [accountStore.accessToken]);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Profile />
      <PostList />
      <Footer />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1, // 전체 화면을 채우도록 설정
    justifyContent: 'flex-start', // 기본적인 내용 배치를 위로 설정 (기본값이므로 선택사항)
    backgroundColor: '#fff',
  },
});

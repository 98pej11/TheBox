import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Footer from './Footer';
import Header from './Header';
import Profile from './MyProfile';

export default function MyFeed() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Profile />
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

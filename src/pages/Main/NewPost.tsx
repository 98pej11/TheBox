// NewPost.tsx
import React from 'react';
import {View, Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../types/navigationTypes';

type NewPostRouteProp = RouteProp<RootStackParamList, 'NewPost'>;

export default function NewPost() {
  const route = useRoute<NewPostRouteProp>();
  const navigation = useNavigation();
  const {photo} = route.params; // ← 여기서 경로를 받음

  return (
    <View style={styles.container}>
      {/* 1:1 비율로 이미지 표시 */}
      <Image source={{uri: 'file://' + photo}} style={styles.image} />

      {/* 뒤로가기 */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'black'},
  image: {
    aspectRatio: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  closeText: {fontSize: 28, color: 'white'},

  bottomButtons: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonText: {color: 'white', fontSize: 18},
});

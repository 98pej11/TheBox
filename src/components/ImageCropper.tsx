import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import {useImageCrop} from '../hooks/useImageCrop';

interface ImageCropperProps {
  photo: string;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({photo}) => {
  const {imagePosition, imageSize, onImageLoad, panResponder, cropSize} =
    useImageCrop();

  return (
    <View style={styles.imageWrapper}>
      <View style={[styles.cropContainer, {width: cropSize, height: cropSize}]}>
        <View style={styles.imageContainer} {...panResponder.panHandlers}>
          <Image
            source={{uri: 'file://' + photo}}
            style={[
              styles.image,
              {
                width: imageSize.width,
                height: imageSize.height,
                transform: [
                  {translateX: imagePosition.x},
                  {translateY: imagePosition.y},
                ],
              },
            ]}
            onLoad={onImageLoad}
            resizeMode="cover"
          />
        </View>
        <View style={styles.cropGuide}>
          <Text style={styles.cropGuideText}>드래그해서 위치 조정</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    paddingVertical: 8,
    overflow: 'hidden',
  },
  cropContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cropGuide: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cropGuideText: {
    color: '#fff',
    fontSize: 12,
  },
});

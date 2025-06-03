// SelectionButtons.tsx
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

interface SelectedItems {
  category: string[];
  mention: number[];
  location: {
    locationName: string;
    latitude: number;
    longitude: number;
  };
}

interface SelectionButtonsProps {
  selectedItems: SelectedItems;
  onOpenModal: (type: 'category' | 'mention' | 'location') => void;
}

export const SelectionButtons: React.FC<SelectionButtonsProps> = ({
  selectedItems,
  onOpenModal,
}) => {
  return (
    <View>
      <TouchableOpacity onPress={() => onOpenModal('category')}>
        <Text>카테고리: {selectedItems.category.join(', ')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onOpenModal('mention')}>
        <Text>친구: {selectedItems.mention.join(', ')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onOpenModal('location')}>
        <Text>위치: {selectedItems.location.locationName}</Text>
      </TouchableOpacity>
    </View>
  );
};

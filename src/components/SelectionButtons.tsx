import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {friendsStore} from '../stores/friendsStore';

interface SelectionButtonsProps {
  selectedItems: {
    category: string[];
    mention: number[];
    location: {locationName: string; latitude: number; longitude: number}[];
  };
  onOpenModal: (type: 'category' | 'mention' | 'location') => void;
}

export const SelectionButtons: React.FC<SelectionButtonsProps> = ({
  selectedItems,
  onOpenModal,
}) => {
  // 선택된 친구 ID들을 이름으로 변환
  const getSelectedFriendNames = (friendIds: number[]): string => {
    if (!friendIds || friendIds.length === 0) {
      return 'Mention';
    }

    const friendNames = friendIds
      .map(id => {
        const friend = friendsStore.friendList?.find(f => f.id === id);
        return friend ? friend.lastName + friend.firstName : `ID:${id}`;
      })
      .filter(name => name !== null);

    return friendNames.length > 0 ? friendNames.join(', ') : 'Mention';
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => onOpenModal('category')}>
        <Text>🔖</Text>
        <Text style={styles.iconLabel}>
          {selectedItems.category.length > 0
            ? selectedItems.category.join(', ')
            : 'Category'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => onOpenModal('mention')}>
        <Text>👤</Text>
        <Text style={styles.iconLabel}>
          {getSelectedFriendNames(selectedItems.mention)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => onOpenModal('location')}>
        <Text>📍</Text>
        <Text style={styles.iconLabel}>
          {selectedItems.location.length > 0
            ? selectedItems.location.map(loc => loc.locationName).join(', ')
            : 'Location'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    flexDirection: 'row',
    marginLeft: 8,
    marginBottom: 12,
  },
  iconLabel: {
    fontSize: 13,
    marginLeft: 10,
    color: '#4b4b4b',
  },
});

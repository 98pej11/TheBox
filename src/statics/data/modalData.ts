import {friendsStore} from '../../stores/friendsStore';

export const getModalData = () => {
  const friendNames =
    friendsStore.friendList?.map(
      friend => friend.lastName + friend.firstName,
    ) || [];

  return {
    category: [
      '여행',
      '가족',
      '친구',
      '일상',
      '기념일 / 특별일',
      '셀카',
      '자연 / 풍경',
      '취미 / 라이프스타일',
      '음식',
      '반려동물',
      '기타',
    ],
    mention: friendNames,
    location: ['서울', '부산', '제주'],
  };
};

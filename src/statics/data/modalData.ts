import {friendsStore} from '../../stores/friendsStore';

// 친구 데이터 타입 정의
interface FriendOption {
  id: number;
  name: string;
}

export const getModalData = () => {
  // 친구 목록을 id와 name을 포함하는 객체 배열로 변환
  const friendOptions: FriendOption[] =
    friendsStore.friendList?.map(friend => ({
      id: friend.id, // 친구의 실제 ID
      name: friend.lastName + friend.firstName, // 표시될 이름
    })) || [];

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
    mention: friendOptions, // 이제 {id, name} 객체 배열
    location: ['서울', '부산', '제주'],
  };
};

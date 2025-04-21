export interface Friend {
  id: number;
  imageUrl: string;
  firstName: string;
  lastName: string;
}

export interface FriendList {
  userId: number;
  friendCount: number;
  friendList: Friend[];
}

import {makeAutoObservable, runInAction} from 'mobx';

import {getFriendList} from '../apis/getFriendList';
import {deleteFriend} from '../apis/deleteFriend';
import {getFriendProfile} from '../apis/getFriendProfile';

import {UserInfo, UserProfile} from '../types/accountTypes';
import {Friend, FriendList} from '../types/friendTypes';

class FriendsStore {
  friendList: Friend[] = [];
  friendCount: number = 0;
  userInfo: UserInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    birthday: '',
  };
  userProfile: UserProfile = {
    profileMessage: '',
    profileImageUrl: '',
    profileLink: '',
  };
  constructor() {
    makeAutoObservable(this);
  }

  async fetchFriendList() {
    try {
      const response: FriendList = await getFriendList();
      console.log(response);
      runInAction(() => {
        this.friendList = response.friendList;
        this.friendCount = response.friendCount;
      });
    } catch (error) {
      runInAction(() => {});
    }
  }

  async fetchFriendProfile(id: number) {
    try {
      const response = await getFriendProfile(id);
      console.log(response);
      // 예정
      // this.userInfo = {...response.userInfo};
      // this.userProfile = {...response.userProfile};
      runInAction(() => {});
    } catch (error) {
      runInAction(() => {});
    }
  }

  async deleteFriend(id: number) {
    try {
      const response = await deleteFriend(id);
      console.log(response);
      runInAction(() => {});
    } catch (error) {
      runInAction(() => {});
    }
  }
}

export const friendsStore = new FriendsStore();

import {action, runInAction, makeAutoObservable} from 'mobx';

import {postLogin} from '../apis/postLogin';
import {postSignUp} from '../apis/postSignUp';
import {UserInfo, UserProfile} from '../types/accountTypes';
import {postEmailCode} from '../apis/postEmailCode';
import {getMyProfile} from '../apis/getMyProfile';

class AccountStore {
  loginId: string = 'aaa@fake.com';
  password: string = 'password';
  userInfo: UserInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    birthday: '',
  };
  digitCode: string = '';
  accessToken: string = '';
  userProfile: UserProfile = {
    profileMessage: '',
    profileImageUrl: '',
    profileLink: '',
  };

  constructor() {
    makeAutoObservable(this, {setLogin: action});
  }

  setLoginId(id: string) {
    this.loginId = id;
    this.userInfo.email = id;
  }

  setDigitCode(code: string) {
    this.digitCode = code;
  }

  setPassword(value: string) {
    this.password = value;
  }

  // setFirstName(value: string) {
  //   this.userInfo.firstName = value;
  // }

  // setLastName(value: string) {
  //   this.userInfo.lastName = value;
  // }

  sendEmailCode() {
    console.log(this.userInfo.email);
    postEmailCode(this.userInfo.email)
      .then((res: any) => {
        runInAction(() => {
          console.log(res);
          this.digitCode = res.data;
        });
      })
      .catch(error => {
        console.log('실패', error);
      });
  }

  // 로그인
  setLogin() {
    postLogin(this.loginId, this.password)
      .then((res: any) => {
        console.log('성공', res);
        runInAction(() => {
          console.log(res);
          this.accessToken = res.accessToken;
        });
      })
      .catch(error => {
        console.log('실패', error);
      });
  }

  // 회원가입
  setSignUp() {
    console.log('요청', this.loginId, this.password, this.userInfo);
    postSignUp(this.loginId, this.password, this.userInfo)
      .then((res: any) => {
        console.log('성공', res);
        runInAction(() => {
          console.log(res);
        });
      })
      .catch(error => {
        console.log('실패', error);
        runInAction(() => {});
      });
  }

  async fetchMyProfile() {
    try {
      const response = await getMyProfile();
      console.log(response);

      // 안전하게 값을 할당 (null이나 undefined여도 오류 없이 처리)
      this.loginId = response.loginId || '';
      this.userInfo = {...response.userInfo};
      this.userProfile = {...response.userProfile};
      // console.log(response.userInfo);
      // userProfile이 존재하는지 확인 후 값 할당
    } catch (error) {
      console.error('프로필 불러오기 실패:', error);
    }
  }

  updateProfile(
    profileImageUrl: string,
    profileMessage: string,
    profileLink: string,
  ) {
    this.userProfile.profileImageUrl = profileImageUrl;
    this.userProfile.profileMessage = profileMessage;
    this.userProfile.profileLink = profileLink;
  }
}

export const accountStore = new AccountStore();

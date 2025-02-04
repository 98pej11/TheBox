import {action, runInAction, makeAutoObservable} from 'mobx';

import {postLogin} from '../apis/postLogin';
import {postSignUp} from '../apis/postSignUp';
import {UserInfo} from '../types/accountTypes';
import {postEmailCode} from '../apis/postEmailCode';

class AccountStore {
  private _loginId: string = 'abc@gmail.com';
  private _password: string = 'password';
  private _userInfo: UserInfo = {
    firstName: 'ㅇㅇ',
    lastName: 'ㅇㅇ',
    email: 'abc@gmail.com',
    phoneNumber: '01011112222',
    birthday: '2000-01-12',
  };
  private _digitCode: string = '';

  constructor() {
    makeAutoObservable(this, {setLogin: action});
  }

  public get loginId(): string {
    return this._loginId;
  }
  public set loginId(value: string) {
    this._loginId = value;
  }

  public get password(): string {
    return this._password;
  }
  public set password(value: string) {
    this._password = value;
  }

  public get userInfo(): UserInfo {
    return this._userInfo;
  }
  public set userInfo(value: UserInfo) {
    this._userInfo = value;
  }

  public get digitCode(): string {
    return this._digitCode;
  }
  public set digitCode(value: string) {
    this._digitCode = value;
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

  setFirstName(value: string) {
    this.userInfo.firstName = value;
  }

  setLastName(value: string) {
    this.userInfo.lastName = value;
  }

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
  setLogin() {
    postLogin(this.loginId, this.password);
  }

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
}

export const accountStore = new AccountStore();

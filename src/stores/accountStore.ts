import {action, runInAction, makeAutoObservable} from 'mobx';

import {postLogin} from '../apis/postLogin';

class AccountStore {
  private _loginId: string = 'aaa@gmail.com';
  private _password: string = 'aaaa';

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

  setLogin() {
    postLogin(this.loginId, this.password)
      .then((res: any) => {
        console.log('실행');
        runInAction(() => {
          console.log(res);
        });
      })
      .catch(error => {
        console.log(error);
        runInAction(() => {});
      });
  }
}

export const accountStore = new AccountStore();

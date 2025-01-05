// types.ts 또는 navigationTypes.ts
export type RootStackParamList = {
  Home: undefined;
  Details: {id: number};
  Profile: {username: string};
  Verification: {from: string};
  Password: undefined;
  Email: undefined;
  Name: undefined; // 'Name' 스크린 추가
  Login: undefined; // Login 스크린 추가
  PhoneNumber: undefined;
  Birthday: undefined;
};

// types.ts 또는 navigationTypes.ts
export type RootStackParamList = {
  Home: undefined;
  // Details: {id: number};
  // Profile: {username: string};
  Verification: {from: string};
  Password: undefined;
  Email: undefined;
  Name: undefined;
  Login: undefined;
  PhoneNumber: undefined;
  Birthday: undefined;
  MyFeed: undefined;
  ProfileEdit: undefined;
  FriendList: undefined;
  FriendFeed: {id: number};
  CameraScreen: undefined;
  NewPost: {photo?: string; video?: string};
  AllPosts: undefined;
};

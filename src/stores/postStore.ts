import {makeAutoObservable, runInAction} from 'mobx';
import {getPost} from '../apis/getPost';
import {getFriendPost} from '../apis/getFriendPost';
import {Post, PostsResponse} from '../types/postTypes';
import {getAllPosts} from '../apis/getAllPosts';

// 응답 데이터의 타입 정의
class PostStore {
  posts: Post[] = [];
  next: string | null = null;
  previous: string | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // 내 데이터를 불러오는 함수
  async fetchMyPosts(tab: string) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await getPost(tab);

      // 응답 타입에 맞춰서 상태 업데이트
      runInAction(() => {
        const {results, next, previous}: PostsResponse = response.data;
        this.posts = results;
        this.next = next;
        this.previous = previous;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = '데이터를 불러오는 중 오류가 발생했습니다.';
        this.isLoading = false;
        this.posts = [];
      });
    }
  }

  // 친구 데이터를 불러오는 함수
  async fetchFriendPosts(userId: number) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await getFriendPost(userId);

      // 응답 타입에 맞춰서 상태 업데이트
      runInAction(() => {
        const {results, next, previous}: PostsResponse = response.data;
        this.posts = results;
        this.next = next;
        this.previous = previous;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = '데이터를 불러오는 중 오류가 발생했습니다.';
        this.isLoading = false;
        this.posts = [];
      });
    }
  }

  // 친구 데이터를 불러오는 함수
  async fetchAllPosts() {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await getAllPosts();

      // 응답 타입에 맞춰서 상태 업데이트
      runInAction(() => {
        const {results, next, previous}: PostsResponse = response.data;
        this.posts = results;
        this.next = next;
        this.previous = previous;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = '데이터를 불러오는 중 오류가 발생했습니다.';
        this.isLoading = false;
        this.posts = [];
      });
    }
  }

  // 포스트 목록 초기화
  clearPosts() {
    this.posts = [];
    this.next = null;
    this.previous = null;
  }
}

const postStore = new PostStore();
export default postStore;

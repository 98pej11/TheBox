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
  isLoadingMore: boolean = false; // 무한스크롤 로딩 상태 추가
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
        const {results, next, previous}: PostsResponse = response;
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

  // 전체 데이터를 불러오는 함수
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

  // 무한스크롤: 더 많은 게시물 불러오기
  async fetchMoreAllPosts() {
    // next URL이 없거나 이미 로딩 중이면 실행하지 않음
    if (!this.next || this.isLoadingMore) {
      return;
    }

    this.isLoadingMore = true;
    this.error = null;

    try {
      // next URL을 직접 호출 (axios 등의 http 클라이언트 사용)
      const response = await fetch(this.next);
      const data = await response.json();

      runInAction(() => {
        const {results, next, previous}: PostsResponse = data;
        // 기존 posts에 새로운 결과 추가
        this.posts = [...this.posts, ...results];
        this.next = next;
        this.previous = previous;
        this.isLoadingMore = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = '추가 데이터를 불러오는 중 오류가 발생했습니다.';
        this.isLoadingMore = false;
      });
    }
  }

  // 각 타입별 무한스크롤 함수들도 추가 가능
  async fetchMoreMyPosts(tab: string) {
    if (!this.next || this.isLoadingMore) {
      return;
    }

    this.isLoadingMore = true;
    this.error = null;

    try {
      const response = await fetch(this.next);
      const data = await response.json();

      runInAction(() => {
        const {results, next, previous}: PostsResponse = data;
        this.posts = [...this.posts, ...results];
        this.next = next;
        this.previous = previous;
        this.isLoadingMore = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = '추가 데이터를 불러오는 중 오류가 발생했습니다.';
        this.isLoadingMore = false;
      });
    }
  }

  async fetchMoreFriendPosts(userId: number) {
    if (!this.next || this.isLoadingMore) {
      return;
    }

    this.isLoadingMore = true;
    this.error = null;

    try {
      const response = await fetch(this.next);
      const data = await response.json();

      runInAction(() => {
        const {results, next, previous}: PostsResponse = data;
        this.posts = [...this.posts, ...results];
        this.next = next;
        this.previous = previous;
        this.isLoadingMore = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = '추가 데이터를 불러오는 중 오류가 발생했습니다.';
        this.isLoadingMore = false;
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

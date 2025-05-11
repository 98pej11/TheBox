import {makeAutoObservable, runInAction} from 'mobx';
import {getPost} from '../apis/getPost';

// 응답 데이터의 타입 정의
interface Post {
  id: number;
  content: {
    contentType: string;
    contentUrl: string;
    createdAt: string;
  };
  location: {
    locationName: string;
    latitude: number;
    longitude: number;
  };
  text: string;
  tagIds: number[];
}

interface PostResponse {
  next: string | null;
  previous: string | null;
  results: Post[];
}

class PostStore {
  posts: Post[] = [];
  next: string | null = null;
  previous: string | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // 포스트 데이터를 불러오는 함수
  async fetchPosts(tab: string) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await getPost(tab);

      // 응답 타입에 맞춰서 상태 업데이트
      runInAction(() => {
        const {results, next, previous}: PostResponse = response;
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

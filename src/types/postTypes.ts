export interface PostContent {
  contentType: string;
  contentUrl: string;
  date: string;
  time: string;
}

export interface Location {
  locationName: string;
  latitude: number;
  longitude: number;
}

export interface Post {
  id: number;
  userId: number;
  content: PostContent;
  location: Location;
  text: string;
  tagIds: number[];
  categories: string[];
}

export interface PostsResponse {
  next: string | null;
  previous: string | null;
  results: Post[];
}

export interface PostRequestData {
  contentUrl: string;
  location: {
    locationName: string;
    latitude: number;
    longitude: number;
  };
  text: string;
  tagIds: number[];
  categories: string[];
}

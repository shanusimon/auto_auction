export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Media {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

export interface Post {
  description: string;
  media: string | null;
  mediaType: "image" | "video" | null; 
}

export interface PostProps {
  _id: string;
  userId:{
    name:string,
    profileImage:string
  } ;
  description: string;
  media: string;
  mediaType: string;
  createdAt: string;
  likes: string[];
  comments: string[];
  __v?: number;
}
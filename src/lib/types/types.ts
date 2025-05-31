export interface Post {
  title: string;
  description: string;
  uploader: string;
  uploader_id: string;
  file_id: string;
  videoUrl: string;
  timeAgo: string;
  timestamp: Date;
  likes: number;
}

export interface Comment {
  comment: string;
  commenter: string;
  timestamp: Date;
  timeAgo: string;
  replies?: Comment[];
  comment_id?: string;
  likes?: number;
}

export interface PostError {
  file?: string;
  title?: string;
  description?: string;
  fileSize?: string;
  fileType?: string;
  authorized?: string;
  authenticated?: string;
}

export interface UserError {
  [key: string]: string;
}

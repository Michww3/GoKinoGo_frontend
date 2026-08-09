import { apiClient } from "./client";
import type { User } from "./auth";

export interface Comment {
  id: number;
  content: string;
  creationDate: string;
  owner?: CommentOwner | null;
  likesCount: number;
  isLikedByCurrentUser: boolean;
}

export interface CommentOwner {
  id: number;
  name: string;
}

export const CommentApi = {
  getForMovie: (movieId: number) =>
    apiClient.get<Comment[]>(`/movies/${movieId}/Comments`).then((res) => res.data),

  create: (movieId: number, content: string) =>
    apiClient.post<Comment>(`/movies/${movieId}/Comments`, { content }).then((res) => res.data),

  remove: (movieId: number, commentId: number) =>
    apiClient.delete<void>(`/movies/${movieId}/Comments/${commentId}`).then((res) => res.data),

  toggleLike: (movieId: number, commentId: number) =>
    apiClient.post<void>(`/movies/${movieId}/Comments/${commentId}/like`).then((res) => res.data),
};
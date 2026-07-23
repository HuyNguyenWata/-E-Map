export interface FavoriteView {
  id: number;
  name: string;
  cameraIds: number[];
  createdAt: string;
}

export interface CreateFavoriteViewInput {
  name: string;
  cameraIds: number[];
}

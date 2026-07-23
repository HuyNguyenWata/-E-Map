export interface VideoBookmark {
  id: number;
  cameraId: number;
  cameraName: string;
  label: string;
  timestamp: string;
  createdByUsername: string;
  createdAt: string;
}

export interface CreateBookmarkInput {
  cameraId: number;
  label: string;
  timestamp: string;
}

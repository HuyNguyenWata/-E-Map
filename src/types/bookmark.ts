export interface VideoBookmark {
  id: number;
  cameraId: number;
  cameraName: string;
  label: string;
  timestamp: string;
  // null = bookmark tự động tạo bởi hệ thống theo sự kiện AI (H14).
  createdByUsername: string | null;
  createdAt: string;
}

export interface CreateBookmarkInput {
  cameraId: number;
  label: string;
  timestamp: string;
}

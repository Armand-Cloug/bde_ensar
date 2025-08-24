export type GalleryEventRow = {
  id: string;
  title: string;
  description: string | null;
  isActive: boolean;
  coverImage: string | null;
  createdAt: string;
  photosCount: number;
};

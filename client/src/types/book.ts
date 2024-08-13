export type Book = {
    id: number;
    genre?: string;
    title?: string;
    tagline?: string;
    description?: string;
    coverImgFileId?: number;
    views: number;
    likes: number;
    createdAt: Date;
    updatedAt: Date;
}
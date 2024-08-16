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

export type Chapter = {
    id: number;
    title?: string;
    numOfWords?: number;
    status?: string;
    bookId: number;
    ordering: number;
    type?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type Readlist = {
    id: number;
    userId: number;
    title?: string;
    description?: string;
    books: Book[];
    createdAt: Date;
    updatedAt: Date;
}

export type User = {
    id: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    profilePicFileId?: number;
    createdAt: Date;
    updatedAt: Date;
}

export type APIResponse<T> = {
    statusCode: number;
    message: string;
    data?: T;
}
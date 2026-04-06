export type CreateUser = {
    username: string;
    password: string;
}

export type LoginUser = {
    username: string;
    password: string;
}

export type User = {
    id: number;
    username: string;
    password: string;
    createdAt: string;
    updatedAt: string;
    token?: string;
}

export type PublicUser = {
    id: number;
    username: string;
    createdAt: string;
}
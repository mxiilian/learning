export type CreateUser = {
    username: string;
    password: string;
};

export type LoginUser = {
    username: string;
    password: string;
};

export type User = {
    id: number;
    username: string;
    createdAt: string;
    isAdmin: boolean;
    token?: string;
};

export type PublicUser = {
    id: number;
    username: string;
    createdAt: string;
    isAdmin: boolean;
};

export type LoginResponse = {
    status: string;
    token: string;
    user: User;
};

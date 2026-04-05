import { apiFetch } from "./api";
import { CreateUser, LoginUser, User, PublicUser } from "./model/userModel";

export async function createUser(userData: CreateUser): Promise<User> {
    return apiFetch<User>('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
}


export async function loginUser(loginUser: LoginUser): Promise<User> {
    return apiFetch<User>('/users/login', {
        method: 'POST',
        body: JSON.stringify(loginUser),
    });
}
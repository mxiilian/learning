import { apiFetch } from './api';
import { CreateUser, LoginUser, User, LoginResponse } from './model/userModel';

export async function createUser(userData: CreateUser): Promise<User> {
    return apiFetch<User>('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
}

export async function loginUser(loginData: LoginUser): Promise<LoginResponse> {
    return apiFetch<LoginResponse>('/users/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
    });
}

import { IUser } from './types';

export let usersState: IUser[] = [];

export const updateUsersState = (user: IUser[])  => {
    usersState = user;
};

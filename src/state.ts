import { IUser } from './types.js';

export let usersState: IUser[] = [];

export const updateUsersState = (user: IUser[])  => {
    usersState = user;
};

import {IUser} from "./user.interface";

export interface IAdmin extends IUser {
    _id: string;
    role: 'admin' | 'owner';
}
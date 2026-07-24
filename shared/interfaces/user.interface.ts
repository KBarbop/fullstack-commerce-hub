export interface IUser {
    _id: string;
    __t: string;
    username: string;
    email: string;
    password?: string;
    passwordRe?: string;
    firstName: string;
    lastName: string;
    matchPassword(enteredPassword: string): Promise<boolean>
}
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { IUser } from '../../../../shared';

const initialState = {
    user: {} as IUser,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logInUser: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload;
        },
        reduxLogOutUser: (state) => {
            state.user = {} as IUser;
        },
        updateUser: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload;
        },
    },
});
export const { logInUser, reduxLogOutUser, updateUser } =
    userSlice.actions;
export const userSelector = (state: RootState) =>
    state.user.user;
export default userSlice.reducer;

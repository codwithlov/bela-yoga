import { IUser } from "@/interfaces/user";
import { createAsyncThunk, createSlice, isRejectedWithValue, PayloadAction } from "@reduxjs/toolkit";
import { usersApi } from "../services/api/users";

const initialState = {
    id: 0,
    name: '',
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (state, action) => {

        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            usersApi.endpoints.getUsers.matchFulfilled,
            (state, action) => {
                console.log('>>>>>> test add addMather usersSlice');
                state.name = 'added addMather usersSlice';
            },
        )
    },
})

export default usersSlice.reducer;
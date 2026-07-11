
import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../services/api/baseApi';
import usersSlice from './usersSlice';
import searchSlice from './searchSlice';
import adminNavSlice from './adminNavSlice';
import selectColumnSlice from './selectColumnSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            [baseApi.reducerPath]: baseApi.reducer,
            user: usersSlice,
            search: searchSlice,
            adminNav: adminNavSlice,
            selectColumn: selectColumnSlice,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(
                baseApi.middleware
            ),
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

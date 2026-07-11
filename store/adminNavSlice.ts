import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showAdminNav: false,
    redirectlink: '',
    slugPermalink: {} as any,
}

const adminNavSlice = createSlice({
    name: 'adminNavSlice',
    initialState,
    reducers: {
        setShowAdminNav: (state, action) => {
            state.showAdminNav = action.payload;
        },
        setRedirectLink: (state, action) => {
            state.redirectlink = action.payload;
        },
        setSlugPermalink: (state, action) => {
            state.slugPermalink = action.payload;
        },
    },
})

export const {
    setShowAdminNav,
    setRedirectLink,
    setSlugPermalink
} = adminNavSlice.actions;

export default adminNavSlice.reducer;
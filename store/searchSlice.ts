
import { createSlice } from "@reduxjs/toolkit";
import { HORIZONTAL_VIEW, VERTICAL_VIEW, VI_DATE_FORMAT, VI_LOCALE } from "@/constants/ui";

const initialState = {
    /** Path or Path Params */
    pathWithParam: null,
    slug: null,
    keyword: null,
    marketTypeSlug: "tour-nuoc-ngoai",
    // nationPath: null,
    // destinationPath: null,
    flightDateParam: null,
    /** End */

    topicParam: null,
    topicNameSearch: null,
    filterSearch: null,
    viewType: VERTICAL_VIEW,
    // viewType: HORIZONTAL_VIEW,
    defaultPage: 0,
    searchTitle: null,
    sortActive: null,
    isDuringFilter: false,
    isSearchResultLoadMore: false,
    /** Search bar */
    searchBarLocation: '',
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setViewType: (state, action) => {
            state.viewType = action.payload;
        },
        setUrlWithParam: (state, action) => {
            state.pathWithParam = action.payload;
        },
        setDefaultPage: (state, action) => {
            state.defaultPage = action.payload ?? 1;
        },
        setMarketTypeSlug: (state, action) => {
            state.marketTypeSlug = action.payload;
        },
        // setNationPath: (state, action) => {
        //     state.nationPath = action.payload;
        // },
        setDynamicSlug: (state, action) => {
            state.slug = action.payload;
        },
        setKeywordParam: (state, action) => {
            state.keyword = action.payload;
        },
        setFlightDateParam: (state, action) => {
            state.flightDateParam = action.payload;
        },
        setTopicParam: (state, action) => {
            state.topicParam = action.payload;
        },
        setTopicName: (state, action) => {
            state.topicNameSearch = action.payload;
        },
        setFilterSearchParam: (state, action) => {
            state.filterSearch = action.payload;
        },
        setSearchTitle: (state, action) => {
            state.searchTitle = action.payload;
        },
        setSortActive: (state, action) => {
            state.sortActive = action.payload;
        },
        // setDayValueFilter: (state, action) => {
        //     state.dayValueFilter = action.payload
        // },
        // setMarketValueFilter: (state, action) => {
        //     state.marketValueFilter = action.payload
        // },
        // setDestinationValueFilter: (state, action) => {
        //     state.destinationValueFilter = action.payload
        // },
        // setSeatValueFilter: (state, action) => {
        //     state.seatValueFilter = action.payload
        // },
        setDuringFilter: (state, action) => {
            state.isDuringFilter = action.payload
        },
        setSearchResultLoadMore: (state, action) => {
            state.isSearchResultLoadMore = action.payload
        },
        setSearchBarLocation: (state, action) => {
            state.searchBarLocation = action.payload
        },
    },
})

export const {
    setViewType,
    setUrlWithParam,
    setDefaultPage,
    // setNationPath,
    // setDestinationPath,
    setDynamicSlug,
    setMarketTypeSlug,
    setKeywordParam,
    setFlightDateParam,
    setTopicParam,
    setTopicName,
    setFilterSearchParam,
    setSearchTitle,
    setSortActive,
    // setDayValueFilter,
    // setSeatValueFilter,
    setDuringFilter,
    setSearchBarLocation,
    setSearchResultLoadMore
    // setMarketValueFilter,
    // setDestinationValueFilter
} = searchSlice.actions;

export default searchSlice.reducer;
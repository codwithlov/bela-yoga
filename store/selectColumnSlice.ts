
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ColumnState {
    selectedColumns: string[];
    columnsOptions: any[];
}

const initialState: ColumnState = {
    selectedColumns: [],
    columnsOptions: [],
};

const selectColumnSlice = createSlice({
    name: 'selectColumnSlice',
    initialState,
    reducers: {
        setSelectedColumns: (state, action: PayloadAction<string[]>) => {
            state.selectedColumns = action.payload;
        },

        setColumnsOptions: (state, action: PayloadAction<any[]>) => {
            state.columnsOptions = action.payload;
        },
    },
});

export const { setSelectedColumns, setColumnsOptions } = selectColumnSlice.actions;
export default selectColumnSlice.reducer;

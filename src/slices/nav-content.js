import { createSlice } from '@reduxjs/toolkit';
import { ComparetorStorageService, JsonItemStorageService } from '../services/StorageService'

const initialState = {
    content: {
        comparetors: null,
        jsonItems: null,
    }
}


const slice = createSlice({
    name: 'nav_content',
    initialState,
    reducers: {
        setNavContent(oldState, action) {
            const navContent = action.payload;
            oldState.content = {...navContent}
        }
    }
});

export const refreshNavContent = () =>  async (dispatch) => {
    const comparetors = await ComparetorStorageService.getAll()
    const jsonItems = await JsonItemStorageService.getAll();
    dispatch(slice.actions.setNavContent({comparetors, jsonItems}));
} 

export const reducer = slice.reducer;


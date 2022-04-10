import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: null,
    json: {
        actual: null,
        expect: null
    },
    uuid: ""
}

const slice = createSlice({
    name: 'selected-json-item',
    initialState,
    reducers: {
        setName(oldState, { payload }) {
            return { ...oldState, name: payload }
        },
        setActualJson(oldState, { payload }) {
            return { ...oldState, json: { ...oldState.json, actual: payload } }
        },
        setExpectJson(oldState, { payload }) {
            return { ...oldState, json: { ...oldState.json, expect: payload } }
        },
        setState(oldState, { payload }) {
            return { ...payload }
        }
    }
});

export const setName = (name) => (dispatch) => {
    dispatch(slice.actions.setName(name));
}

export const setActualJson = (json) => (dispatch) => {
    dispatch(slice.actions.setActualJson(json));
}

export const setExpectJson = (json) => (dispatch) => {
    dispatch(slice.actions.setExpectJson(json));
}

export const setState = (state) => (dispatch) => {
    dispatch(slice.actions.setState(state));
}

export const reducer = slice.reducer;


import { createSlice } from '@reduxjs/toolkit';


const placeholderA = {
    "array": [
        1,
        2,
        [
            1, 2, 3
        ],
    ],
    "boolean": true,
    "color": "gold",
    "null": null,
    "number": 123,
    "object": {
        "a": "b",
        "c": "d"
    },
    "string": "Hello World"
};

const placeholderE = {
    "arr": [
        1,
        2,
        [
            1, 2, 3
        ],
    ],
    "bool": true,
    "color": "gold",
    "none": null,
    "num": 123,
    "obj": {
        "a": "b",
        "c": "d"
    },
    "str": "Hello World"
};

const initialState = {
    name: null,
    json: {
        actual: placeholderA,
        expect: placeholderE
    },
    uuid: ""
}

const slice = createSlice({
    name: 'tmp-selected-json-item',
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

export const refresh = () => (dispatch) => {
    dispatch(slice.actions.setState(initialState));
}

export const reducer = slice.reducer;


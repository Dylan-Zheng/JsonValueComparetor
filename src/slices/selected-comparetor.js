import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: null,
    json: {
        actual: null,
        expect: null
    },
    props: {
        actual: null,
        expect: null,
    },
    items: [],
    uuid: ""
}

const slice = createSlice({
    name: 'selected-comparetor',
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
        setActualProps(oldState, { payload }) {
            return { ...oldState, props: { ...oldState.props, actual: {...payload} } }
        },
        setExpectProps(oldState, { payload }) {
            return { ...oldState, props: { ...oldState.props, expect: {...payload} } }
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

export const setActualProps = (mapper) => (dispatch) => {
    dispatch(slice.actions.setActualProps(mapper));
}

export const setExpectProps = (mapper) => (dispatch) => {
    dispatch(slice.actions.setExpectProps(mapper));
}

export const setState = (state) => (dispatch) => {
    dispatch(slice.actions.setState(state));
}

export const refresh = () => (dispatch) => {
    dispatch(slice.actions.setState(initialState));
}

export const reducer = slice.reducer;


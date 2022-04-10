import { useState } from "react"
import { Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { useDispatch, useSelector } from "react-redux";
import { setActualJson, setExpectJson } from "../../../slices/tmp-selected-comparetor";

const JSONInputSetting = {
    confirmGood: false,
    locale: locale,
    theme: "light_mitsuketa_tribute",
    width: "100%"
}

const useStyle = makeStyles((theme) => ({
    root: {
        height: "100%"
    },
    titleBox: {
        display: "flex",
        height: "auto",
        alignItem: "center"
    },
    jsonInputOuter: {
        display: "flex",
        height: "calc(100% - 70px)"
    },
    jsonInputInner: {
        height: "100%",
        width: "50%",
        margin: "0px 10px 0px 10px",
        border: "1px solid #CCCCCC",
        boxSizing: "content-box",
    },
    jsonInputWrapper: {
        overflow: "visible",
        height: "calc(100% - 40px)"
    }
}))

const jsonEditorStyle = {
    height: "100%"
}

const InputJsonTemplateView = () => {

    const classes = useStyle()
    const dispatch = useDispatch()

    const [jsonInputHeight, setJsonInputHeight] = useState();

    const { json: { actual, expect } } = useSelector(store => store.tmpComparetor)

    const setActual = (json) => {
        dispatch(setActualJson(json));
    }

    const setExpect = (json) => {
        dispatch(setExpectJson(json));
    }

    return (
        <Box className={classes.root}>
            <Box className={classes.titleBox} >
                <Box width="50%">
                    <Toolbar>
                        <Typography margin="auto" variant="h5" gutterBottom component="div">
                            Actual
                        </Typography>
                    </Toolbar>
                </Box>
                <Box width="50%">
                    <Toolbar>
                        <Typography margin="auto" variant="h5" gutterBottom component="div">
                            Expect
                        </Typography>
                    </Toolbar>
                </Box>
            </Box>
            <Box className={classes.jsonInputOuter}>
                <Box className={classes.jsonInputInner}>
                    <JSONInput
                        id='1'
                        height="100%"
                        onChange={({ jsObject, error }) => !error && setActual(jsObject)}
                        onBlur={({ jsObject, error }) => !error && setActual(jsObject)}
                        placeholder={actual}
                        {...JSONInputSetting}
                    />
                </Box>
                <Box className={classes.jsonInputInner}>
                    <JSONInput
                        id='2'
                        height="100%"
                        onChange={({ jsObject, error }) => !error && setExpect(jsObject)}
                        onBlur={({ jsObject, error }) => !error && setExpect(jsObject)}

                        placeholder={expect}
                        {...JSONInputSetting}
                    />
                </Box>
            </Box>
        </Box>
    )
}

export default InputJsonTemplateView;

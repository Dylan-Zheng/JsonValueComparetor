import { useState } from "react"
import { Button, TextField, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { useDispatch, useSelector } from "react-redux";
import { setActualJson, setExpectJson, setName } from "../../../slices/tmp-selected-json-item";
import { setState as setSelectedJsonItemState } from "../../../slices/selected-json-item";
import { JsonItemStorageService } from "../../../services/StorageService";
import { refreshNavContent } from "../../../slices/nav-content";
import { useNavigate } from "react-router";



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
    jsonInputBoxRoot: {
        height: "calc(100% - 64px)"
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
    },
    bottomBox: {
        margin: "10px",
        display: "flex",
    }
}))

const jsonEditorStyle = {
    height: "100%"
}

const JsonItemConfig = () => {

    const classes = useStyle()
    const dispatch = useDispatch()
    const navigator = useNavigate()

    const cuuid = useSelector(store => store.selectedComparetor).uuid;

    const tmpSelectedJsonItem = useSelector(store => store.tmpSelectedJsonItem);
    const { name, json: { actual, expect }, uuid } = tmpSelectedJsonItem;
    console.log(tmpSelectedJsonItem)

    const setActual = (json) => {
        dispatch(setActualJson(json));
    }

    const setExpect = (json) => {
        dispatch(setExpectJson(json));
    }

    const onCreateOrUpateClick = async () => {
        let newJsonItem;
        if (uuid) {
            newJsonItem = await JsonItemStorageService.updateAndReturn(cuuid, tmpSelectedJsonItem)
        } else {
            newJsonItem = await JsonItemStorageService.saveAndReturn(cuuid, tmpSelectedJsonItem);
        }
        dispatch(refreshNavContent());
        dispatch(setSelectedJsonItemState(newJsonItem));
        navigator("/app/comparetor/view/json")
    }

    const onNameChange = (e) => {
        dispatch(setName(e.target.value));
    }

    const onCancelClick = (e) => {
        if (uuid) {
            navigator("/app/comparetor/view/json");
        } else {
            navigator("/app/comparetor");
        }
    
    }

    return (
        <Box className={classes.root}>
            <Box className={classes.jsonInputBoxRoot}>
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
            <Box className={classes.bottomBox}>
                <Box flexGrow="1" mr="10px">
                    <TextField id="outlined-basic" label="Comparetor Name" variant="outlined" size="small" fullWidth
                        value={name ? name : ""}
                        onChange={onNameChange}
                        onBlur={onNameChange}
                        InputLabelProps={{ shrink: true }}
                    />
                </Box>
                <Box mr="10px">
                    <Button variant="contained" onClick={() => onCreateOrUpateClick()}>
                        {uuid ? "Update" : "Create"}
                    </Button>
                </Box>
                <Box mr="10px">
                    <Button variant="contained" color="error" onClick={() => onCancelClick()}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}
export default JsonItemConfig;
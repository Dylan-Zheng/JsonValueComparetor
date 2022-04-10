import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import { Button, TextField, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box, boxSizing, display, width } from "@mui/system";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setName } from "../../../slices/tmp-selected-comparetor";


const useStyle = makeStyles((theme) => ({
    root: {
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
    },
}));


const FolderNameView = () => {

    const classes = useStyle();
    const dispatch = useDispatch();

    const { name } = useSelector(store => store.tmpComparetor)

    const onNameChange = (e) => {
        dispatch(setName(e.target.value));
    }

    return (
        <Box className={classes.root}>
            <TextField id="outlined-basic" label="Comparetor Name" variant="outlined" size="small" style={{ width: '50%' }}
                InputLabelProps={{ shrink: true }}
                value={name ? name : ""}
                onChange={onNameChange}
            />
        </Box>
    )
}

export default FolderNameView;



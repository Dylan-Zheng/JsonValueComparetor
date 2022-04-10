import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box, maxHeight } from "@mui/system";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { Outlet } from "react-router-dom";
import storageService, { ComparetorStorageService } from "../../services/StorageService";
import { refreshNavContent } from "../../slices/nav-content";
import { setState as setSelectedComparetorState } from "../../slices/selected-comparetor";
import { refresh } from "../../slices/tmp-selected-comparetor";



const useStyle = makeStyles((theme) => ({
    root: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column"
    },
    childern: {
        width: "100%",
        height: "calc(100% - 60px)"
    },
    buttonBox: {
        display: "flex",
        width: "auto",
        margin: "10px",
        minHeight: "40px",
        maxHeight: "40px"

    },
}))

const TEMPLATE = "template";
const MAPPING = "mapping";
const CREATE = "create";

const ConfigComparetor = () => {

    const childernPath = [TEMPLATE, MAPPING, CREATE]

    const classes = useStyle();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [showBack, setShowBack] = useState(false);
    const [showNext, setShowNext] = useState(true);
    const [showCreate, setShowCreate] = useState(false);

    const tmpComparetor = useSelector(store => store.tmpComparetor);
    const { uuid } = tmpComparetor

    const getChildernIndex = () => {
        const pathnames = location.pathname.split('/').filter((x) => x);
        const path = pathnames[pathnames.length - 1]
        return childernPath.findIndex(e => e == path)
    };

    const onCreateClick = async () => {
        let comparetor = null;
        if (uuid) {
            comparetor = await ComparetorStorageService.updateAndReturn(tmpComparetor);
        }else {
            comparetor = await ComparetorStorageService.saveAndReturn(tmpComparetor);
        }
        dispatch(setSelectedComparetorState(comparetor))
        dispatch(refreshNavContent());
        navigate("/app/comparetor")
    }

    useEffect(() => {
        const index = getChildernIndex()
        setShowBack(index != 0);
        setShowNext(index != childernPath.length - 1);
        setShowCreate(index == childernPath.length - 1)
    }, [location])

    useEffect(() => {
        if(!uuid) {
            dispatch(refresh());
        }
    }, [])

    const onClick = (factor) => {
        const index = getChildernIndex()
        const num = factor <= 0 ? -1 : 1;
        navigate(childernPath[index + num]);
    }

    return (
        <Box className={classes.root}>
            <Box className={classes.childern}>
                <Outlet />
            </Box>
            <Box className={classes.buttonBox}>
                {showBack && <Button variant="contained" onClick={() => onClick(-1)}>
                    Back
                </Button>}
                {uuid && !showBack && <Button variant="contained" color="error" onClick={() =>navigate("/app/comparetor")}>
                    Cancel
                </Button>}
                <Box flexGrow="1" />
                {showNext && <Button variant="contained" onClick={() => onClick(1)}>
                    Next
                </Button>}
                {showCreate && <Button variant="contained" onClick={() => onCreateClick()}>
                    {uuid ? "Update" : "Create"}
                </Button>}
            </Box>
        </Box>
    )
}

export default ConfigComparetor;
import { Button } from "@mui/material"
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system"
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router";
import { ComparetorStorageService } from "../../services/StorageService";
import { refreshNavContent } from "../../slices/nav-content";
import { refresh as refreshSelectedComparetorState } from "../../slices/selected-comparetor";
import { setState as setTmpSelectedComparetorState} from "../../slices/tmp-selected-comparetor";
import { refresh as refreshTmpSelectedJsonItemState } from "../../slices/tmp-selected-json-item";

const useStyle = makeStyles((theme) => ({
    root: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    btn: {
        margin: "10px",
    }
}));

const FolderView = () => {
    const classes = useStyle();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const selectedComparetor = useSelector(store => store.selectedComparetor)

    const onCreateJsonCompareItemClick = () => {
        dispatch(refreshTmpSelectedJsonItemState());
        navigate("/app/comparetor/create/json");
    }
    
    const onSettingClick = () => {
        dispatch(setTmpSelectedComparetorState(selectedComparetor));
        navigate("/app/comparetor/config");
    }

    const onDeleteClick = async () => {
        await ComparetorStorageService.remove(selectedComparetor);
        dispatch(refreshSelectedComparetorState());
        dispatch(refreshNavContent);
        navigate("/app")
    }

    return (
        <Fragment>
            {
                location.pathname == "/app/comparetor" &&
                <Box className={classes.root}>
                    <Button className={classes.btn}
                        variant="contained"
                        onClick={onCreateJsonCompareItemClick}
                    >
                        {"Create Json Compare Item"}
                    </Button>
                    <Button className={classes.btn}
                        variant="contained"
                        onClick={onSettingClick}
                    >
                        {"Setting"}
                    </Button>
                    <Button className={classes.btn}
                        variant="contained"
                        color="error"
                        onClick={onDeleteClick}
                    >
                        {"Delete"}
                    </Button>
                </Box>
            }
            <Outlet />
        </Fragment>

    )
}

export default FolderView;
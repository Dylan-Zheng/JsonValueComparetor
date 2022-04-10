import { Button, Grid } from "@mui/material"
import { makeStyles } from "@mui/styles";
import { Box, flexbox, height } from "@mui/system"
import { useNavigate } from "react-router";

const useStyle = makeStyles((theme) => ({
    root: {
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },

}));

const HomeView = () => {
    const classes = useStyle();
    const navigate = useNavigate()

    return (
        <Box className={classes.root}>
            <Button
                variant="contained"
                onClick={() => navigate("/app/config/comparetor")}
            >
                {"New Comparetor"}
            </Button>
        </Box>
    )
}

export default HomeView;
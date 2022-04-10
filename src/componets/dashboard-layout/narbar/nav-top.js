import { Toolbar, Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { makeStyles } from "@mui/styles";
import sideNarWidth from "../index"

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%"
    },
    titleBox:  {
        display: "flex",
        width: "100%"
    },
    title: {
        flex: "flex-grow",
        width: "100%"
    }
}));

const NavTop = () => {
    let classes = useStyles();
    return (
        <Toolbar position="fixed">
            <Box className={classes.titleBox}>
                <Box className={classes.title}>Comparetor</Box>
            </Box>
        </Toolbar>
    );
}

export default NavTop;

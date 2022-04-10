import { AppBar, Toolbar } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import NavDrawer from "./narbar/nav-draw";
import BreadCrumbsNav from "./breadcrumbs-nav"
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { refreshNavContent } from "../../slices/nav-content";

export const sideNarWidth = 240;

const DashBoardLayout = ({ children }) => {
    const dispatch = useDispatch()
    useEffect(() => dispatch(refreshNavContent()) )

    return (
        <Box sx={{ display: 'flex', height: "100vh"}}>
            <CssBaseline />
            <NavDrawer width={sideNarWidth} />
            <AppBar position="fixed" color="primary"
                sx={{ width: `calc(100% - ${sideNarWidth}px)`, ml: `${sideNarWidth}px` }}>
                <Toolbar>
                    <BreadCrumbsNav />
                </Toolbar>
            </AppBar>
            <Box
                component="main"
                sx={{ flexGrow: 1, width: `calc(100% - ${sideNarWidth}px)`, height: "100%"}}
            >
                <Toolbar />
                <Box sx={{ width: "100%", height: "calc(100% - 64px)"}} >
                    {children}
                </Box>
            </Box>
        </Box>
    )
}

export default DashBoardLayout;
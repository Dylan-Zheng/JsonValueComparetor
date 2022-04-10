import Box from "@mui/material/Box";
import React from "react";
import NavDrawer from "./nav-draw";


const NavBar = ({width}) => {
    return (
        <Box
            component="nav"
            sx={{width: {sm: width}, flexShrink: {sm: 0}}}
            aria-label="mailbox folders"
        >
            <NavDrawer/>
        </Box>
    )
}

export default NavBar;
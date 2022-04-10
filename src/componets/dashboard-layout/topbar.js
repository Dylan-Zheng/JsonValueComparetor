import { AppBar, Toolbar, Typography } from "@mui/material";


const Topbar = ({sideNarWidth}) => {
    return (
        <AppBar
            position="fixed"
            sx={{
                width: { sm: `calc(100% - ${sideNarWidth}px)` },
                ml: { sm: `${sideNarWidth}px` },
              }}
        >
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    Tools
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Topbar;
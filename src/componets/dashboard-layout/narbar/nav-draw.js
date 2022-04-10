import Box from "@mui/material/Box";
import { Divider, Drawer, List, ListItem } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import NavTop from "./nav-top"
import { useSelector } from "react-redux";
import NavFolder from "./nav-folder";



const useStyles = makeStyles((theme) => ({
    scollOuter: {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #cccccc"
    },
    scroll: {
        overflowY: "scroll",
        height: "100%"
    },
}));


const NavDrawer = ({ width }) => {

    const { content } = useSelector((store) => store.navContent)

    const classes = useStyles()

    return (

        <Drawer
            sx={{
                width: width,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: width,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Box>
                <NavTop position="fixed" width={width} />
            </Box>
            <Divider />
            <Box className={classes.scroll}>
                <List>
                    {Object.keys(content.comparetors ? content.comparetors : {}).map(key => content.comparetors[key]).map((comparetor, index) =>
                        <NavFolder
                            key={index}
                            comparetor={comparetor}
                            items={content.jsonItems[comparetor.uuid] ? content.jsonItems[comparetor.uuid] : {}}
                        />
                    )}
                </List>
            </Box>
        </Drawer>
    );
}

export default NavDrawer;
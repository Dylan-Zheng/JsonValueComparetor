import { useEffect, useState } from "react"
import { Button, Checkbox, FormControlLabel, FormGroup, Modal, Table, TableBody, TableCell, TableRow, TextField, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";

import { useDispatch, useSelector } from "react-redux";
import ReactJson from 'react-json-view'
import { csvToArray, objectToPaths } from "../../../utils/object-utils";
import LinkOffIcon from '@mui/icons-material/LinkOff';
import LinkIcon from '@mui/icons-material/Link';
import HdrAutoIcon from '@mui/icons-material/HdrAuto';
import { setActualProps, setExpectProps } from "../../../slices/tmp-selected-comparetor";


const jsonViewSetting = {
    theme: "summerfruit:inverted",
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "50vw",
    bgcolor: 'white',
    border: "1px solid #CCCCCC",
    p: 4,
};


const useStyle = makeStyles((theme) => ({
    root: {
        height: "100%"
    },
    titleBox: {
        display: "flex",
        alignItem: "center",
        height: "64px"

    },
    jsonViewOuter: {
        display: "flex",
        height: "calc(40% - 64px)"
    },
    jsonViewInner: {
        height: "100%",
        width: "50%",
        margin: "0px 10px 0px 10px",
        border: "1px solid #CCCCCC",
        boxSizing: "content-box",
        overflow: "scroll"
    },
    jsonPathOuter: {
        display: "flex",
        marginTop: "10px"
    },
    jsonPathInner: {
        display: "flex",
        justifyContent: "stretch",
        width: "100%",
        margin: "10px",
        boxSizing: "content-box",
    },
    pathTableOuter: {
        display: "flex",
        height: "40%"
    },
    pathTableInner: {
        display: "flex",
        width: "100%",
        height: "100%",
        margin: "0px 10px 0px 10px",
        boxSizing: "content-box",
        border: "1px solid #CCCCCC",
        overflow: "scroll"
    },
    tableCell: {
        display: 'flex',
        alignItems: "center",
    },
}))

const MappingView = () => {

    const classes = useStyle();

    const { json, props } = useSelector(store => store.tmpComparetor);

    const dispatch = useDispatch();

    const [openModal, setOpenModal] = useState(false);

    const [csv, setCSV] = useState("");

    const [data, setData] = useState({
        actual: {
            search: "",
            filteredPaths: [],
        },
        expect: {
            search: "",
            filteredPaths: [],
        }
    });

    const [filerConfig, setFilerConfig] = useState({
        mapped: false,
        unmap: false,
    });

    const [selectedPath, setSelectedPath] = useState({
        actual: "",
        expect: "",
    })

    const setActualSearch = (path) => {
        setData(data => ({ ...data, actual: { ...data.actual, search: path } }));
    }

    const setExpectSearch = (path) => {
        setData(data => ({ ...data, expect: { ...data.expect, search: path } }));
    }

    const setActualFilteredPaths = (paths) => {
        setData(data => ({ ...data, actual: { ...data.actual, filteredPaths: paths } }));
    }

    const setExpectFilteredPaths = (paths) => {
        setData(data => ({ ...data, expect: { ...data.expect, filteredPaths: paths } }));
    }

    const setActualPathProps = (path, prop) => {
        const pathPorps = { ...props.actual };
        pathPorps[path] = prop;
        dispatch(setActualProps(pathPorps));
    }

    const setExpectPathProps = (path, prop) => {
        const pathPorps = { ...props.expect };
        pathPorps[path] = prop;
        dispatch(setExpectProps(pathPorps));
    }

    const filterPaths = (pathProps, search) => {
        const { mapped, unmap } = filerConfig
        if ((mapped && unmap) || (!mapped && !unmap)) {
            return Object.keys(pathProps).filter(path => path.includes(search)).sort()
        } else if (mapped) {
            return Object.keys(pathProps).filter(path => path.includes(search) && pathProps[path].isMapped).sort()
        } else if (unmap) {
            return Object.keys(pathProps).filter(path => path.includes(search) && !pathProps[path].isMapped).sort()
        }
    }

    const objectToPathProps = (object, oldProps) => {
        const pathProps = {};
        objectToPaths(object).forEach(path => {
            if (!oldProps || !oldProps[path]) {
                pathProps[path] = {
                    isMapped: false,
                    linkedWith: null,
                }
            } else {
                pathProps[path] = oldProps[path];
            }
        })
        return pathProps;
    }

    const onJsonViewSelected = (e, object) => {
        let path;
        let tmpObj = object;
        if (e.namespace && e.namespace.length > 0) {
            path = e.namespace.reduce((path, attrName, index) => {
                const lastObj = tmpObj;
                tmpObj = lastObj[attrName];
                if (Array.isArray(lastObj)) {
                    return path + "[" + attrName + "]";
                } else {
                    return path + '.' + attrName;
                }
            }, "");
            if (Array.isArray(tmpObj)) {
                path = path + "[" + e.name + "]"
            } else {
                path = path + '.' + e.name
            }
        } else {
            path = "." + e.name;
        }
        return path;
    };

    const linkTwoPaths = (pathA, pathE) => {
        if (!props.actual[pathA] || !props.expect[pathE]) {
            return;
        }
        if (props.actual[pathA].isMapped) {
            let linkedPath = props.actual[pathA].linkedWith;
            let linkedPathProps = { linkedWith: null, isMapped: false }
            setExpectPathProps(linkedPath, linkedPathProps);
        }
        if (props.expect[pathE].isMapped) {
            let linkedPath = props.expect[pathE].linkedWith;
            let linkedPathProps = { linkedWith: null, isMapped: false }
            setActualPathProps(linkedPath, linkedPathProps);
        }
        setActualPathProps(pathA, { linkedWith: pathE, isMapped: true });
        setExpectPathProps(pathE, { linkedWith: pathA, isMapped: true });
    }

    const linkOffTwoPaths = (pathA, pathE) => {
        let isMappedA = props.actual[pathA].isMapped;
        let isMappedE = props.expect[pathE].isMapped;
        let linkedPathA = props.actual[pathA].linkedWith;
        let linkedPathE = props.expect[pathE].linkedWith;

        if (isMappedA && isMappedE && linkedPathA == pathE && linkedPathE == pathA) {
            setActualPathProps(pathA, { linkedWith: null, isMapped: false });
            setExpectPathProps(pathE, { linkedWith: null, isMapped: false });
        }

    }

    const linkOnAndOff = (pathA, pathE) => {
        const pathPropA = props.actual[pathA];
        const pathPropE = props.expect[pathE];
        if ((pathPropA && pathPropE) && (pathPropA.isMapped && pathPropE.isMapped)) {
            linkOffTwoPaths(pathA, pathE)
        } else {
            linkTwoPaths(pathA, pathE)
        }
    }

    const isSameDimension = (pathA, pathB) => {
        const regex = /\[.*?\]/g;
        const a = pathA.match(regex);
        const b = pathB.match(regex);
        if (!Array.isArray(a) || !Array.isArray(b)) {
            return true;
        }
        return a.length == b.length;
    }

    const batchLinkTwoPaths = (pairs) => {

        const actualProps = { ...props.actual };
        const expectProps = { ...props.expect }
        pairs.forEach(([pathA, pathE]) => {
            if (!props.actual[pathA] || !props.expect[pathE]) {
                return;
            }
            if (props.actual[pathA].isMapped) {
                let linkedPath = actualProps[pathA].linkedWith;
                expectProps[linkedPath] = { linkedWith: null, isMapped: false }
            }
            if (props.expect[pathE].isMapped) {
                let linkedPath = props.expect[pathE].linkedWith;
                actualProps[linkedPath] = { linkedWith: null, isMapped: false }
            }
            actualProps[pathA] = { linkedWith: pathE, isMapped: true }
            expectProps[pathE] = { linkedWith: pathA, isMapped: true }
        });
        dispatch(setActualProps(actualProps));
        dispatch(setExpectProps(expectProps));
    }

    const onAutoMappingClick = (e) => {
        const keyMapper = csvToArray(csv);
        const paths = Object.keys(props.expect);
        const filedNameMapper = {};
        paths.forEach(path => filedNameMapper[path] = path);
        keyMapper.forEach(kv => {
            const regexp = new RegExp(kv[1], 'g')
            paths.forEach(path => filedNameMapper[path] = filedNameMapper[path].replace(regexp, kv[0]));
        })
        batchLinkTwoPaths(paths.map(path => [filedNameMapper[path], path]))
        setOpenModal(() => false);
    }

    useEffect(() => {
        if (json.actual) {
            let pathProps = objectToPathProps(json.actual, props.actual);
            dispatch(setActualProps(pathProps))
        }
        if (json.expect) {
            let pathProps = objectToPathProps(json.expect, props.expect);
            dispatch(setExpectProps(pathProps))
        }
    }, []);

    useEffect(() => {
        setActualFilteredPaths(filterPaths(props.actual ? props.actual : {}, data.actual.search));
        setExpectFilteredPaths(filterPaths(props.expect ? props.expect : {}, data.expect.search));
    }, [data.actual.search, data.expect.search, props.actual, props.expect, filerConfig])

    return (
        <Box className={classes.root}>
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
            <Box className={classes.jsonViewOuter}>
                <Box className={classes.jsonViewInner}>
                    <ReactJson
                        src={json.actual ? json.actual : {}}
                        displayObjectSize={false}
                        displayDataTypes={false}
                        enableClipboard={false}
                        onSelect={(e) => setActualSearch(onJsonViewSelected(e, json.actual))}
                    />
                </Box>
                <Box className={classes.jsonViewInner}>
                    <ReactJson
                        src={json.expect ? json.expect : {}}
                        displayObjectSize={false}
                        displayDataTypes={false}
                        enableClipboard={false}
                        onSelect={(e) => setExpectSearch(onJsonViewSelected(e, json.expect))}
                    />
                </Box>
            </Box>
            <Box className={classes.jsonPathOuter}>
                <Box className={classes.jsonPathInner}>
                    <TextField id="outlined-basic" label="Actual Json Path" variant="outlined" size="small" style={{ width: '100%' }}
                        InputLabelProps={{ shrink: true, }}
                        value={data.actual.search ? data.actual.search : ""}
                        onChange={(event) => { setActualSearch(event.target.value) }}
                    />
                </Box>
                <Box className={classes.jsonPathInner}>
                    <TextField id="outlined-basic" label="Expect Json Path" variant="outlined" size="small" style={{ width: '100%' }}
                        InputLabelProps={{ shrink: true }}
                        value={data.expect.search ? data.expect.search : ""}
                        onChange={(event) => { setExpectSearch(event.target.value) }}
                    />
                </Box>
            </Box>
            <Box display="flex" ml="10px" alignItems="center">
                <HdrAutoIcon color="primary" onClick={() => setOpenModal(() => true)} />
                <Box flexGrow="1" />
                <FormGroup aria-label="position" row>
                    <FormControlLabel
                        defaultChecked={filerConfig.mapped}
                        control={<Checkbox onChange={(e) => {
                            setFilerConfig((config) => ({ ...config, mapped: e.target.checked }))
                        }
                        } />}
                        label="Linked"
                        labelPlacement="end"
                    />
                    <FormControlLabel
                        defaultChecked={filerConfig.unmap}
                        control={<Checkbox onChange={(e) => setFilerConfig((config) => ({ ...config, unmap: e.target.checked }))} />}
                        label="Unlink"
                        labelPlacement="end"
                    />
                </FormGroup>
            </Box>
            <Box className={classes.pathTableOuter}>
                <Box className={classes.pathTableInner}>
                    <Table width="100%" size="small" aria-label="a dense table">
                        <TableBody>
                            {data.actual.filteredPaths.length > 0 && data.actual.filteredPaths.map(path => (
                                <TableRow key={path} >
                                    <TableCell
                                        className={classes.tableCell}
                                        onClick={() => setSelectedPath((selectedPath) => ({ ...selectedPath, actual: path }))}
                                    >
                                        {path}<Box flexGrow={1} />{(() => {
                                            return props.actual[path].isMapped
                                        })() ?
                                            <LinkIcon color="primary" onClick={() => setExpectSearch(props.actual[path].linkedWith)} /> :
                                            <LinkOffIcon color="error" />}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
                <Box className={classes.pathTableInner}>
                    <Table width="100%" size="small" aria-label="a dense table">
                        <TableBody>
                            {data.expect.filteredPaths.length > 0 && data.expect.filteredPaths.map((path) => (
                                <TableRow key={path}>
                                    <TableCell
                                        className={classes.tableCell}
                                        onClick={() => setSelectedPath((selectedPath) => ({ ...selectedPath, expect: path }))}
                                    >
                                        {path}<Box flexGrow={1} />{props.expect[path].isMapped ?
                                            <LinkIcon color="primary" onClick={() => setActualSearch(props.expect[path].linkedWith)} /> :
                                            <LinkOffIcon color="error" />}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Box>
            <Box className={classes.jsonPathOuter}>
                <Box className={classes.jsonPathInner}>
                    <TextField id="outlined-basic" label="Selected Actual Json Path" variant="outlined" size="small" style={{ width: '100%' }}
                        disabled
                        InputLabelProps={{ shrink: true, }}
                        value={selectedPath.actual ? selectedPath.actual : ""}
                    />
                </Box>
                <Button
                    disabled={selectedPath.actual.isEmpty() || selectedPath.expect.isEmpty() || !isSameDimension(selectedPath.actual, selectedPath.expect)}
                    onClick={() => linkOnAndOff(selectedPath.actual, selectedPath.expect)}
                >{
                        (() => {
                            const pathPropA = props.actual && props.actual[selectedPath.actual];
                            const pathPropE = props.expect && props.expect[selectedPath.expect];
                            if ((pathPropA && pathPropE)
                                && (pathPropA.isMapped && pathPropE.isMapped)
                                && (pathPropA.linkedWith == selectedPath.expect && pathPropE.linkedWith == selectedPath.actual)) {
                                return <LinkOffIcon color="error" />
                            }
                            return <LinkIcon />
                        })()
                    }
                </Button>
                <Box className={classes.jsonPathInner}>
                    <TextField id="outlined-basic" label="Selected Expect Json Path" variant="outlined" size="small" style={{ width: '100%' }}
                        disabled
                        InputLabelProps={{ shrink: true }}
                        value={selectedPath.expect ? selectedPath.expect : ""}
                    />
                </Box>
            </Box>
            <Modal
                open={openModal}
                onClose={() => setOpenModal(() => false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle} width="100%">
                    <TextField
                        label="CSV"
                        multiline
                        rows="10"
                        fullWidth
                        variant="outlined"
                        onChange={e => setCSV(s => e.target.value)}
                    />
                    <Box pt="10px" display="flex">
                        <Box flexGrow="1" />
                        <Button mt="10px" variant="contained" onClick={onAutoMappingClick}
                        >
                            {"Auto Link"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    )
}

export default MappingView

import { Fragment, useEffect, useState } from "react"
import { Button, Card, Divider, IconButton, InputBase, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import locale from 'react-json-editor-ajrm/locale/en';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ReactJson from "react-json-view";
import { objectComparetor } from "../../../utils/object-utils";
import SearchIcon from '@mui/icons-material/Search';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CancelIcon from '@mui/icons-material/Cancel';
import { setState } from "../../../slices/tmp-selected-json-item";
import { JsonItemStorageService } from "../../../services/StorageService";
import { refreshNavContent } from "../../../slices/nav-content";


const JSONInputSetting = {
    confirmGood: false,
    locale: locale,
    theme: "light_mitsuketa_tribute",
    width: "100%"
}

const SELECT_OPTIONS = {
    ALL: "ALL",
    PASS: "PASS",
    FAIL: "FAIL"
}

const useStyle = makeStyles((theme) => ({
    root: {
        height: "100%",
    },
    rootTitleBox: {
        display: "flex",
        alignItem: "center",
        margin: "0px 10px 0px 10px",
    },
    jsonInputBoxRoot: {
        height: "calc(50% - 20px)",
    },
    jsonInputTitleBox: {
        display: "flex",
        height: "auto",
        alignItem: "center",
        justifyContent: "center",
    },
    jsonViewOuter: {
        display: "flex",
        height: "calc(100%)"
    },
    jsonViewInner: {
        height: "100%",
        width: "50%",
        margin: "0px 10px 0px 10px",
        border: "1px solid #CCCCCC",
        boxSizing: "content-box",
    },
    resultTableBox: {
        height: "calc(50% - 50px)",
        width: "calc(100% - 20px)",
        margin: "10px 10px 10px 10px",
        border: "1px solid #CCCCCC",
    },
    resultTableToolBox: {
        display: "flex"
    },
    resultTitleBox: {
        width: "calc(100% - 10px)",
        paddingLeft: "10px",
        display: "flex",
        margin: "5px"
    },
    tableInnerBox: {
        height: "calc(100% - 55px)",
        width: "calc(100 - 20px)",
        overflow: "scroll"
    },
}))

const jsonEditorStyle = {
    height: "100%"
}

const JsonItemView = () => {

    const classes = useStyle()
    const dispatch = useDispatch()
    const navigator = useNavigate()
    const selectedJsonItem = useSelector(store => store.selectedJsonItem);
    const { name, json } = selectedJsonItem;
    const { props, uuid } = useSelector(store => store.selectedComparetor)
    const [tableOption, setTableOption] = useState(SELECT_OPTIONS.ALL)
    const [tableOfContents, setTableOfContents] = useState([]);
    const [search, setSearch] = useState("");

    const onSettingClick = () => {
        dispatch(setState(selectedJsonItem));
        navigator("/app/comparetor/view/json/conifg");
    }

    const onDeleteClick = async () => {
        await JsonItemStorageService.remove(uuid, selectedJsonItem);
        dispatch(refreshNavContent());
        navigator("/app/comparetor");
    }

    const tableOfContentsFilter = () => {
        return tableOfContents.filter(row => {
            const check = row.search.includes(search);
            if (SELECT_OPTIONS.PASS == tableOption) {
                return check && row.result;
            } else if (SELECT_OPTIONS.FAIL == tableOption) {
                return check && !row.result;
            }
            return check
        })
    }

    useEffect(() => {
        const result = objectComparetor(json.actual, json.expect, props.actual)
        let tableOfContents = result.map(row => {
            row["search"] = Object.keys(row).reduce((str, key) => str + row[key], "");
            return row;
        })
        setTableOfContents(() => ([...tableOfContents]));
    }, [json])


    return (
        <Box className={classes.root}>
            <Box className={classes.rootTitleBox}>
                <Typography margin="10px" variant="h5" gutterBottom align="left" component="div">
                    {`Json Item: ${name}`}
                </Typography>
                <Box flexGrow={1} />
                <Box display="flex" alignItems={"center"} >
                    <Button size="small" variant="contained" onClick={onSettingClick}>Setting</Button>
                </Box>
                <Box display="flex" alignItems={"center"} ml="10px" >
                    <Button size="small" variant="contained" color="error" onClick={onDeleteClick}>Delete</Button>
                </Box>
            </Box>
            <Divider></Divider>
            <Box className={classes.jsonInputBoxRoot}>
                <Box className={classes.jsonViewOuter}>
                    <Box className={classes.jsonViewInner}>
                        <Typography margin="10px" variant="h6" gutterBottom align="center" component="div">
                            Actual
                        </Typography>
                        <Divider />
                        <Box height="calc(100% - 53px)" overflow="scroll">
                            <ReactJson
                                src={json.actual ? json.actual : {}}
                                displayObjectSize={false}
                                displayDataTypes={false}
                                enableClipboard={false}
                                onSelect={(e) => setActualSearch(onJsonViewSelected(e, json.actual))}
                            />
                        </Box>

                    </Box>
                    <Box className={classes.jsonViewInner}>
                        <Typography margin="10px" variant="h6" gutterBottom align="center" component="div">
                            Expect
                        </Typography>
                        <Divider />
                        <Box height="calc(100% - 53px)" overflow="scroll">
                            <ReactJson
                                src={json.expect ? json.expect : {}}
                                displayObjectSize={false}
                                displayDataTypes={false}
                                enableClipboard={false}
                                onSelect={(e) => setExpectSearch(onJsonViewSelected(e, json.expect))}
                            />
                        </Box>

                    </Box>
                </Box>
            </Box>
            <Box className={classes.resultTableBox}>
                <Box className={classes.resultTitleBox}>

                    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                    <InputBase flexGrow="1"
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search Result"
                        value={search}
                        onChange={(e) => setSearch(() => e.target.value)}
                    />
                    <Select
                        size="small"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        variant="outlined"
                        value={tableOption}
                        onChange={(e) => setTableOption(() => e.target.value)}
                    >
                        {Object.keys(SELECT_OPTIONS).map(key => <MenuItem value={key}>{key}</MenuItem>)}
                    </Select>
                </Box>
                <Divider />
                <Box className={classes.tableInnerBox}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                {
                                    ["Status", " Path", "Value"].map((name, index) => (
                                        <TableCell key={index} align="left">
                                            {name}
                                        </TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableOfContents && tableOfContentsFilter().map((row, idx) => (
                                <Fragment key={idx}>
                                    <TableRow>
                                        <TableCell width="35px" align="center" rowSpan={2}> {row.result ? <CheckBoxIcon color="success" /> : <CancelIcon color="error" />} </TableCell>
                                        <TableCell>{row.actualPath}</TableCell>
                                        <TableCell>{row.actualValue}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>{row.expectPath}</TableCell>
                                        <TableCell>{row.expectValue}</TableCell>
                                    </TableRow>
                                </Fragment>
                            ))}
                        </TableBody>
                    </Table>

                </Box>
            </Box>
        </Box>
    )
}
export default JsonItemView;
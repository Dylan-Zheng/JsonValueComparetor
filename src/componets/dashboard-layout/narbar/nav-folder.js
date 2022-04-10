import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, List, ListItemButton, ListItemText } from "@mui/material"
import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setState as setSelectedComparetorState } from "../../../slices/selected-comparetor";
import { setState as setSelectedJsonItemState } from "../../../slices/selected-json-item";
import ListItemIcon from '@mui/material/ListItemIcon';
import TopicIcon from '@mui/icons-material/Topic';
import ArticleIcon from '@mui/icons-material/Article';

const NavFolder = ({ comparetor, items }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [open, setOpen] = useState(false);

    const { uuid } = useSelector(store => store.selectedComparetor)

    const handleFolderClick = async () => {
        dispatch(setSelectedComparetorState(comparetor))
        navigate("/app/comparetor")
    }

    const onItemClick = async (item) => {
        dispatch(setSelectedComparetorState(comparetor))
        dispatch(setSelectedJsonItemState(item))
        navigate("/app/comparetor/view/json")
    }

    useEffect(() => {
        setOpen(() => uuid == comparetor.uuid)
    }, [uuid])

    return (
        <Fragment>
            <ListItemButton onClick={handleFolderClick}>
                <ListItemIcon><TopicIcon /></ListItemIcon>
                <ListItemText primary={comparetor.name} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit>
                {items && Object.keys(items).map(key => items[key]).map((item, index) => {
                    return (
                        <ListItemButton sx={{ pl: 4 }} key={index} onClick={() => onItemClick(item)}>
                            <ListItemIcon><ArticleIcon /></ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    )
                })}
            </Collapse>
        </Fragment>
    )

}

export default NavFolder;
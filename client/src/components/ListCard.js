import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const { idNamePair } = props;

    function handleLoadList(event, id) {
        if (!event.target.disabled) {
            store.setCurrentList(id);
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        store.markListForDeletion(id).then(() => {
            props.setShowAlertCallback(true)
            props.setListNameCallback(idNamePair.name)
        })
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let newText = event.target.value
            if (newText === '') {
                newText = 'Untitled'
            }
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, newText);
            toggleEdit();
        }
    }

    let cardElement =
        <ListItem
            disabled={store.isListNameEditActive}
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            button
            onClick={(event) => {
                handleLoadList(event, idNamePair._id)
            }
            }
            style={{
                fontSize: '48pt',
                width: '100%'
            }}
        >
            <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.name}</Box>
            <Box sx={{ p: 1 }}>
                <IconButton
                    // disabled={store.isListNameEditActive}
                    onClick={handleToggleEdit}
                    aria-label='edit'>
                    <EditIcon style={{ fontSize: '48pt' }} />
                </IconButton>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton
                    // disabled={store.isListNameEditActive}
                    onClick={(event) => {
                        handleDeleteList(event, idNamePair._id)
                    }}
                    aria-label='delete'>
                    <DeleteIcon style={{ fontSize: '48pt' }} />
                </IconButton>
            </Box>
        </ListItem>

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Top 5 List Name"
                name="name"
                autoComplete="Top 5 List Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                defaultValue={idNamePair.name}
                InputProps={{ style: { fontSize: 48 } }}
                InputLabelProps={{ style: { fontSize: 24 } }}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;
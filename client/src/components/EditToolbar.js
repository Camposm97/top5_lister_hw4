import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CloseIcon from '@mui/icons-material/HighlightOff';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext)

    function handleUndo() {
        store.undo()
    }
    function handleRedo() {
        store.redo()
    }
    function handleClose() {
        store.closeCurrentList();
    }
    let editStatus = false
    if (store.isItemEditActive) {
        editStatus = true
    }
    return (
        <div id="edit-toolbar">
            <Button
                id='undo-button'
                disabled={!store.canUndo() || editStatus}
                onClick={handleUndo}
                variant="contained">
                <UndoIcon />
            </Button>
            <Button
                id='redo-button'
                disabled={!store.canRedo() || editStatus}
                onClick={handleRedo}
                variant="contained">
                <RedoIcon />
            </Button>
            <Button
                disabled={editStatus}
                id='close-button'
                onClick={handleClose}
                variant="contained">
                <CloseIcon />
            </Button>
        </div>
    )
}

export default EditToolbar;
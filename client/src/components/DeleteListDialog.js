import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import GlobalStoreContext from '../store';
import { SlideDownTransition } from '../util/CamposAnims'

export default function DeleteListDialog(props) {
    const { store } = React.useContext(GlobalStoreContext)

    function closeDialog() {
        props.setShowAlertCallback(false)
    }

    function deleteList() {
        props.setShowAlertCallback(false)
        store.deleteMarkedList()
    }

    return (
        <div>
            <Dialog
                open={props.showAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-desc"
                TransitionComponent={SlideDownTransition}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirmation"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-desc">
                        {'Are you sure you want delete Top 5 ' + props.name + ' List?'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={deleteList} >Confirm</Button>
                    <Button onClick={closeDialog} >Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
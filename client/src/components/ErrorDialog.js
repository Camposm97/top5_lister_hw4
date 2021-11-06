import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const errTitles = [
    "Uh oh.  Something went wrong...", 
    "I didn't do it! I swear!",
    "Oh no! I am error!", 
    "You broke my program!", 
    "I let you down. Sorry :(", 
    "I'm not suppose to be here...",
    "This doesn't make any sense!", 
    "You found me! :D", 
    "Hello! I'm a message for your error :)",
    "ERROR ERROR ERROR", 
    "Aw geez, this wasn't suppose to happen!", 
    "Woopsy daisy!", "My bad.",
    "I didn't do it! I swear!"
]

let errTitle = null

function initErrTitle() {
    return errTitles[Math.floor(Math.random() * errTitles.length)]
}

export default function ErrorDialog(props) {

    if (props.showAlert) {
        errTitle = initErrTitle()
    }

    return (
        <div>
            <Dialog
                open={props.showAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-desc"
                TransitionComponent={Transition}
            >
                <DialogTitle id="alert-dialog-title">
                    {errTitle}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-desc">
                        {props.errMsg}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleCloseDialog}>Ok</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

import Slide from '@mui/material/Slide'
import * as React from 'react'

export const SlideDownTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});
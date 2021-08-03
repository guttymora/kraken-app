import React, {useContext, useEffect, useState} from 'react';
import './toast.style.sass';
import {GlobalContext} from "../../contexts/GlobalContext";
import {ErrorOutlineOutlined as ErrorIcon} from '@material-ui/icons'

const Toast = () => {
    let timeout = null;
    const [shown, setShown] = useState(false);
    const [globalState, dispatch] = useContext(GlobalContext);

    useEffect(() => {
        display();
    }, [globalState.error]);

    const display = () => {
        setShown(true);
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            setShown(false);
        }, 4000);
    };

    return (
        <div id={'global-toast'} className={shown ? 'shown' : ''}>
            <ErrorIcon className={'icon'}/>
            {globalState.error.message}
        </div>
    )
};

export default Toast;

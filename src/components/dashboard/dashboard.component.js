import React from 'react';
import './dashboard.styles.sass';
import {GlobalContext} from "../../contexts/GlobalContext";

const initialState = {
    selectedFile: null
};

const Dashboard = () => {
    const [state, setState] = React.useState(initialState);
    const [globalState, globalDispatch] = React.useContext(GlobalContext);

    return (
        <div id={'dashboard'} onClick={() => globalDispatch('logout')}/>
    )
};

export default Dashboard;

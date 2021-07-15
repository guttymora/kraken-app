import React, {useEffect, useContext} from 'react';
import './window-menu.styles.sass';
import {GlobalContext} from '../../contexts/GlobalContext';

const WindowMenu = () => {
    const [globalState, globalDispatch] = useContext(GlobalContext);

    useEffect(() => {

    });

    const minimizeWindow = () => {
        const remote = window.require('electron').remote;
        remote.getCurrentWindow().minimize();
    };

    const maximizeWindow = () => {
        const remote = window.require('electron').remote;
        remote.getCurrentWindow().maximize();
    };

    const closeApp = () => {
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.send('closeApp', null);
    };

    return (
        <nav id={'window-menu'}
             className={`${globalState.theme === 'dark' ? 'dark-theme' : ''}`}>
            <div id={'logo-container'}>K</div>
            <div id={'window-button-container'}>
                <button className={'window-button'}
                        id={'window-minimize-button'}
                        onClick={minimizeWindow}/>
                <button className={'window-button'}
                        id={'window-maximize-button'}
                        onClick={maximizeWindow}/>
                <button className={'window-button'}
                        id={'window-close-button'}
                        onClick={closeApp}/>
            </div>
        </nav>
    )
};

export default WindowMenu;

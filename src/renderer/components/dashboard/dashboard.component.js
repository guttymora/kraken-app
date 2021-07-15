import React, {useEffect, useState, useContext} from 'react';
import './dashboard.styles.sass';
import {GlobalContext} from "../../contexts/GlobalContext";
import DirectoryList from "../directory-list/directory-list.component";

const dummyData = {
    directoryName: 'kraken-app',
    fileList: [
        'build',
        'node_modules',
        'public',
        'main.js',
        'package.json',
        'readme.md',
    ]
};

const initialState = {
    currentDirectory: dummyData.directoryName,
    fileList: [],
    selectedFile: null,
};

const Dashboard = () => {
    const [state, setState] = useState(initialState);
    const [globalState, globalDispatch] = useContext(GlobalContext);

    useEffect(() => {
        dummyRequestDirectoryFiles();
    }, []);

    const requestDirectoryFiles = () => {
        console.log('> Requesting directory files...');
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.invoke('requestFiles', null).then(files => {
            if (!files) { // Error reading directory
                return console.error('[!] Unable to read directory!');
            }

            if (files.length === 0) { // Directory is empty
                return console.error('[!] Directory is empty!');
            }

            setState(prev => ({...prev, fileList: files}));
        })
    };

    const dummyRequestDirectoryFiles = () => {
        setState(prev => ({...prev, fileList: dummyData.fileList}));
    };

    return (
        <div id={'dashboard'}
             className={`${globalState.theme === 'dark' ? 'dark-theme' : ''}`}>
            <DirectoryList directoryName={state.currentDirectory} fileNames={state.fileList}/>
        </div>
    )
};

export default Dashboard;

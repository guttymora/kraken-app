import React, {useEffect, useState, useContext} from 'react';
import './dashboard.styles.sass';
import {GlobalContext} from '../../contexts/GlobalContext';
import DirectoryList from '../directory-list/directory-list.component';
import FileData from '../file-data/file-data.component';
import DateUtils from '../../utils/date.utils';

const initialState = {
    currentDirectory: '',
    currentFolder: '',
    fileList: [],
    selectedFile: null
};

const Dashboard = () => {
    const [state, setState] = useState(initialState);
    const [globalState, globalDispatch] = useContext(GlobalContext);

    useEffect(() => {
        requestDirectoryFiles(null);
    }, []);

    const requestDirectoryFiles = (folder = null) => {
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.invoke('requestFiles', folder).then(([directoryPath, files]) => {
            if (!directoryPath) { // Error reading directory
                return console.error('[!] Unable to read directory!');
            }

            if (files.length === 0) { // Directory is empty
                return console.error('[!] Directory is empty!');
            }

            const splitPath = directoryPath.split('\\');
            const currentFolder = splitPath[splitPath.length - 1];

            setState(prev => ({
                ...prev,
                currentDirectory: directoryPath,
                currentFolder: currentFolder,
                fileList: files,
                selectedFile: null
            }));
        })
    };

    const selectFile = (fileName) => {
        const selectedFile = state.fileList.find(file => file.name === fileName);
        if (selectedFile) {
            showSelectedFileData(selectedFile);
        }
    };

    const showSelectedFileData = (file) => {
        const ext = !file.isDirectory ? (file.name.split('.'))[1] : '';
        const fileData = {
            name: file.name,
            isDirectory: file.isDirectory,
            extension: ext,
            size: file.stats.size,
            directoryPath: file.directoryPath,
            lastUpdate: DateUtils.formatDate(file.stats.mtime)
        };
        setState(prev => ({
            ...prev,
            selectedFile: fileData
        }));
    };

    const goBackDirectory = () => {
        const directoryArray = state.currentDirectory.split('\\');
        if (directoryArray.length < 2) {
            return console.error('[!] No se puede retroceder mas en el directorio');
        }
        // Remove last folder from directory array to set previous folder as current
        directoryArray.pop();
        requestDirectoryFiles(directoryArray.join('\\'));
    };

    const openFolder = (folder) => {
        requestDirectoryFiles(`${state.currentDirectory}\\${folder}`);
    };

    return (
        <div id={'dashboard'}
             className={`${globalState.theme === 'dark' ? 'dark-theme' : ''}`}>
            <DirectoryList directoryPath={state.currentDirectory}
                           directoryName={state.currentFolder}
                           files={state.fileList}
                           onSelectElement={(fileName) => {
                               selectFile(fileName)
                           }}
                           onGoBack={goBackDirectory}
                           onOpenFolder={(folder) => {
                               openFolder(folder)
                           }}/>
            <div id={'dashboard-file-data-container'}>
                {state.selectedFile ? <FileData file={state.selectedFile}/> : ''}
            </div>
        </div>
    )
};

export default Dashboard;

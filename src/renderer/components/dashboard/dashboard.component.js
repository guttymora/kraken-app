import React, {useEffect, useState, useContext} from 'react';
import './dashboard.styles.sass';
import {GlobalContext} from '../../contexts/GlobalContext';
import DirectoryList from '../directory-list/directory-list.component';
import FileData from '../file-data/file-data.component';

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
    currentFolder: 'C:\\User\\GuttyMora\\kraken-app',
    fileList: [],
    selectedFile: {
        name: 'main.js',
        size: '1036 KB',
        lastModificationDate: '17-07-2021'
    }
};

const Dashboard = () => {
    const [state, setState] = useState(initialState);
    const [globalState, globalDispatch] = useContext(GlobalContext);

    useEffect(() => {
        //requestDirectoryFiles(null);
        dummyRequestDirectoryFiles();
    }, []);

    const requestDirectoryFiles = (folder = null) => {
        console.log('> Requesting directory files...');
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
                fileList: files
            }));
        })
    };

    const dummyRequestDirectoryFiles = () => {
        setState(prev => ({...prev, fileList: dummyData.fileList}));
    };

    const selectFileOrFolder = (fileName) => {
        console.log('file/folder selected:', fileName);
        getFileStats(`${state.currentDirectory}\\${fileName}`, fileName);
    };

    const getFileStats = (filePath, fileName) => {
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.invoke('requestFileStats', filePath).then((info) => {
            if (!info) {
                console.error('[!] Error getting file stats!');
            }
            setState(prev => ({
                ...prev,
                selectedFile: {
                    name: fileName,
                    size: info['size'],
                    lastModificationDate: info['mtime']
                }
            }));
        });
    };

    return (
        <div id={'dashboard'}
             className={`${globalState.theme === 'dark' ? 'dark-theme' : ''}`}>
            <DirectoryList directoryPath={state.currentDirectory}
                           directoryName={state.currentFolder}
                           fileNames={state.fileList}
                           onSelectElement={(fileName) => {
                               selectFileOrFolder(fileName)
                           }}/>
            <div id={'dashboard-file-data-container'}>
                {state.selectedFile ? <FileData fileName={state.selectedFile.name}
                                                size={state.selectedFile.size}
                                                lastModificationDate={state.selectedFile.lastModificationDate}/> : ''}
            </div>
        </div>
    )
};

export default Dashboard;

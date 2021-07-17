import React, {useState, useEffect, useContext} from 'react';
import './directory-element.styles.sass';
import {Description as FileIcon, Folder as FolderIcon} from "@material-ui/icons";
import {GlobalContext} from "../../../contexts/GlobalContext";

const initialState = {
    icon: <FileIcon className={'file-icon'}/>,
    focused: false,
    type: null
};

const DirectoryElement = ({fileName, onSelect}) => {
    const [state, setState] = useState(initialState);
    const [globalState, globalDispatch] = useContext(GlobalContext);

    useEffect(() => {
        getFileType(fileName)
    }, [fileName]);

    const getFileType = (fileName) => {
        let icon = null;
        let type = null;
        if (fileName.indexOf('\.') !== -1) {
            icon = <FileIcon className={'file-icon'}/>;
            type = 'file';
        } else {
            icon = <FolderIcon className={'file-icon'}/>;
            type = 'folder';
        }

        setState(prev => ({...prev, icon: icon, type: type}));
    };

    const setFocus = () => {
        setState(prev => ({...prev, focused: true}));
    };

    const removeFocus = () => {
        setState(prev => ({...prev, focused: false}));
    };

    const open = () => {
        // Check if object type
        if (state.type !== 'folder') {
            return console.error('[!] Cannot be opened!');
        }

        console.log('Folder open!');
    };

    const selectElement = () => {
        onSelect(fileName);
    };

    return (
        <li className={`directory-element ${state.focused ? 'focused' : ''} ${globalState.theme === 'dark' ? 'dark-theme' : ''}`}
            onFocus={setFocus} onBlur={removeFocus} tabIndex={1} onDoubleClick={open} onClick={selectElement}>
            {state.icon}
            <span>{fileName}</span>
        </li>
    )
};

export default DirectoryElement;

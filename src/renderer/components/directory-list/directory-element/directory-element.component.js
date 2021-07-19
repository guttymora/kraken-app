import React, {useState, useEffect, useContext} from 'react';
import './directory-element.styles.sass';
import {Description as FileIcon, Folder as FolderIcon} from "@material-ui/icons";
import {GlobalContext} from "../../../contexts/GlobalContext";

const initialState = {
    icon: <FileIcon className={'file-icon'}/>,
    focused: false,
    type: null
};

const DirectoryElement = ({file, onSelect}) => {
    const [state, setState] = useState(initialState);
    const [globalState, globalDispatch] = useContext(GlobalContext);

    useEffect(() => {
        getFileType(file)
    }, [file.name]);

    const getFileType = (file) => {
        let icon = null;
        let type = null;
        if (file.isDirectory) {
            icon = <FolderIcon className={'file-icon'}/>;
            type = 'folder';
        } else {
            icon = <FileIcon className={'file-icon'}/>;
            type = 'file';
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
        onSelect(file.name);
    };

    return (
        <li className={`directory-element ${state.focused ? 'focused' : ''} ${globalState.theme === 'dark' ? 'dark-theme' : ''}`}
            onFocus={setFocus} onBlur={removeFocus} tabIndex={1} onDoubleClick={open} onClick={selectElement}>
            {state.icon}
            <span>{file.name}</span>
        </li>
    )
};

export default DirectoryElement;

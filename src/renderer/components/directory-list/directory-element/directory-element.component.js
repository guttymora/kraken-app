import React, {useState, useEffect, useContext} from 'react';
import './directory-element.styles.sass';
import {Description as FileIcon, Folder as FolderIcon} from "@material-ui/icons";
import {GlobalContext} from "../../../contexts/GlobalContext";

const initialState = {
    icon: <FileIcon className={'file-icon'}/>,
    focused: false,
    type: null
};

const DirectoryElement = ({file, onSelect, onOpenFolder}) => {
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


    const selectElement = () => {
        onSelect(file.name);
    };

    const open = () => {
        if (file.isDirectory) {
            onOpenFolder(file.name);
        } else {
            return console.error('[!] No es una carpeta!');
        }
        removeFocus();
    };

    return (
        <li className={`directory-element ${state.focused ? 'focused' : ''} ${globalState.theme === 'dark' ? 'dark-theme' : ''}`}
            tabIndex={1}
            onFocus={setFocus}
            onBlur={removeFocus}
            onClick={selectElement}
            onDoubleClick={open}>
            {state.icon}
            <span>{file.name}</span>
        </li>
    )
};

export default DirectoryElement;

import React, {useContext, useEffect, useState} from 'react';
import './directory-list.styles.sass';
import {Folder as FolderIcon} from "@material-ui/icons";
import DirectoryElement from "./directory-element/directory-element.component";
import {GlobalContext} from "../../contexts/GlobalContext";

const DirectoryList = ({directoryName, fileNames}) => {
    const [state, setState] = useState({fileList: []});
    const [globalState, globalDispatch] = useContext(GlobalContext);

    useEffect(() => {
        buildFileList(fileNames);
    }, [fileNames]);

    const buildFileList = (files) => {
        if(!files || files.length === 0) {
            return;
        }

        const list = files.map(file => {
            return (
                <DirectoryElement fileName={file}/>
            )
        });

        setState(prev => ({...prev, fileList: list}));
    };

    return (
        <nav id={'main-directory-list'}
             className={`${globalState.theme === 'dark' ? 'dark-theme' : ''}`}>
            <div className={'title'}>
                <FolderIcon className={'icon'}/>
                <h1>{directoryName ?? ''}</h1>
            </div>
            <ul className={'file-list'}>
                {state.fileList}
            </ul>
        </nav>

    )
};

export default DirectoryList;

import React, {useContext, useEffect, useState} from 'react';
import './directory-list.styles.sass';
import {Folder as FolderIcon, ArrowUpward as GoBackIcon} from "@material-ui/icons";
import DirectoryElement from "./directory-element/directory-element.component";
import {GlobalContext} from "../../contexts/GlobalContext";

const DirectoryList = ({directoryPath, directoryName, files, onSelectElement, onGoBack, onOpenFolder}) => {
    const [state, setState] = useState({fileList: []});
    const [globalState, globalDispatch] = useContext(GlobalContext);

    useEffect(() => {
        buildFileList(files);
    }, [directoryPath]);

    const buildFileList = (files) => {
        if (!files || files.length === 0) {
            return;
        }

        const list = files.map(file => {
            return (
                <DirectoryElement file={file}
                                  onSelect={(fileName) => {
                                      selectElement(fileName)
                                  }}
                onOpenFolder={(folder) => {openFolder(folder)}}/>
            )
        });

        setState(prev => ({...prev, fileList: list}));
    };

    const selectElement = (elementName) => {
        onSelectElement(elementName);
    };

    const goBackDirectory = () => {
        onGoBack()
    };

    const openFolder = (folder) => {
        onOpenFolder(folder)
    };

    return (
        <nav id={'main-directory-list'}
             className={`${globalState.theme === 'dark' ? 'dark-theme' : ''}`}>
            <div className={'title'}>
                <GoBackIcon className={'go-back-icon'} onClick={goBackDirectory}/>
                <FolderIcon className={'folder-icon'}/>
                <input value={directoryName ?? ''} type={'text'}/>
            </div>
            <nav>
                <ul className={'file-list'}>
                    {state.fileList}
                </ul>
            </nav>
        </nav>

    )
};

export default DirectoryList;

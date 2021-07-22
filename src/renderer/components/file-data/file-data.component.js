import React, {useState} from 'react';
import './file-data.sass';
import FileImage from './file.png';
import FolderImage from './folder.png';

const initialState = {
    encrypting: false
};

const FileData = ({file}) => {
    const [state, setState] = useState(initialState);

    const encryptFile = () => {
        if (file.isDirectory) {
            return console.error('[!] Folders cannot be encrypted!');
        }
        console.log('encrypting...');
        setState(prev => ({...prev, encrypting: true}));

        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.invoke('encryptFile', file).then(encryptedFile => {
            console.log(encryptedFile);
            setState(prev => ({...prev, encrypting: false}));
        });
    };

    return (
        <div id={'file-data-container'}>
            <div className={'img-container'}>
                <img src={!file.isDirectory ? FileImage : FolderImage} alt={'kraken-app-file-img'}/>
                <span className={'file-extension'}>{!file.isDirectory ? `.${file.extension}` : ''}</span>
            </div>

            <h1>{file.name}</h1>
            <div className={`metadata ${file.isDirectory ? 'center' : 'space-between'}`}>
                {!file.isDirectory ? <span>Peso: {file.size}</span> : ''}
                <span>Últ. modif.: {file.lastUpdate}</span>
            </div>

            <button id={'encrypt-btn'}
                    className={!file.isDirectory ? 'shown' : ''}
                    onClick={encryptFile}
                    disabled={state.encrypting}>
                {state.encrypting ? 'cargando...' : 'encryptar'}
            </button>
        </div>
    )
};

export default FileData;

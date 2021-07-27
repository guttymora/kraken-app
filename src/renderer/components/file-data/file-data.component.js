import React, {useState} from 'react';
import './file-data.sass';
import FileImage from './file.png';
import FolderImage from './folder.png';

const initialState = {
    encrypting: false
};

const FileData = ({file}) => {
    const [state, setState] = useState(initialState);

    const translateFile = () => {
        if (file.isDirectory) {
            return console.error('[!] Folders cannot be translated!');
        }

        setState(prev => ({...prev, encrypting: true}));

        if (file.extension === 'kraken') {
            decryptFile();
        } else {
            encryptFile();
        }
    };

    const encryptFile = () => {
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.invoke('encryptFile', file).then(encryptedFile => {
            console.log(encryptedFile);
            setState(prev => ({...prev, encrypting: false}));
        });
    };

    const decryptFile = () => {
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.invoke('decryptFile', file).then(encryptedFile => {
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
                    onClick={translateFile}
                    disabled={state.encrypting}>
                {state.encrypting ? 'cargando...' : file.extension === 'kraken' ? 'desencriptar' : 'encriptar'}
            </button>
        </div>
    )
};

export default FileData;

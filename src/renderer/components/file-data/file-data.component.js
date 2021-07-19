import React from 'react';
import './file-data.sass';
import FileImage from './file.png';
import FolderImage from './folder.png';

const FileData = ({file}) => {
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
        </div>
    )
};

export default FileData;

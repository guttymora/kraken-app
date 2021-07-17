import React from 'react';
import './file-data.sass';

const FileData = ({fileName, size, lastModificationDate}) => {
    return (
        <div id={'file-data-container'}>
            <h1>{fileName}</h1>
            <div className={'metadata'}>
                <span>Peso: {size}</span>
                <span>Últ. modif.: {lastModificationDate}</span>
            </div>
        </div>
    )
};

export default FileData;

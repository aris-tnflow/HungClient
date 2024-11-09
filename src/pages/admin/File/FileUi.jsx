import React from 'react';
import { FileMosaic } from "@files-ui/react";

const FileUi = ({ size, name, imageUrl, onDelete, onClick, onDownload }) => (
    <FileMosaic
        onClick={onClick}
        onDownload={onDownload}
        onDelete={onDelete}
        info
        preview
        size={size}
        name={name}
        imageUrl={imageUrl}
    />
);

export default FileUi;
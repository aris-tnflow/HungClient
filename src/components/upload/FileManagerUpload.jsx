import React from 'react';
import { Button, Upload } from 'antd';
import { toastError, toastSuccess } from '../toast';
import { baseURL } from '~/utils';
import { FaUpload } from 'react-icons/fa6';

const FileManagerUpload = ({ name, folder, multiple = false }) => {
    return (
        <Upload
            name={name}
            multiple={multiple}
            action={`${baseURL}/v1/file/video`}
            data={{ folder: `courses/${folder}` }}
            headers={{
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            }}
            onChange={(info) => {
                const { status, response } = info.file;
                if (status === 'done') {
                    toastSuccess('Success', 'Tải file thành công!');
                } else if (status === 'error') {
                    toastError('Error', 'Lỗi khi tải file!', response.message);
                    info.fileList = [];
                }
            }}
        >
            <Button className='hidden-title' icon={<FaUpload size={20} />} type='text'>Tải lên file</Button>
        </Upload>
    );
};

export default FileManagerUpload;

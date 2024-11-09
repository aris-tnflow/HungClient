import React from 'react';
import { useEditor } from '@grapesjs/react';
import { Col, Row, Tabs } from 'antd';
import FileUi from '~/components/upload/FileUi';
import DemoImagePreview from '~/pages/admin/File/FileUi';
import { toastSuccess } from '~/components/toast';
// import { BTN_CLS } from './common';

export default function CustomAssetManager({ assets, select, close }) {
  const editor = useEditor();

  const remove = (asset) => {
    editor.Assets.remove(asset);
  };

  const sampleFileProps = {
    size: 28 * 1024 * 1024,
    name: "Thor arrives wakanda.jpg",
    imageUrl: "https://cdn.wallpapersafari.com/0/95/1zms6H.jpg"
  };

  return (
    <>
      <Tabs
        defaultActiveKey="uploads"
        centered
        items={[
          {
            key: 'uploads',
            label: 'UPLOADS FILES',
            children:
              <>
                <FileUi
                  header={<></>}
                  // footer={'Cho phép tải lên các loại về file ảnh!'}
                  title={`Kéo thả file để cập nhập bài học`}
                  api={'http://localhost:5000/api/upload'}
                />
              </>,
          },
          {
            key: 'library-page',
            label: 'PHOTO LIBRARY PAGE',
            children: <>
              <Row gutter={[14, 14]} className='justify-center pt-2'>
                {assets.map((asset) => (
                  <div key={asset}>
                    <Col>
                      <DemoImagePreview
                        {...sampleFileProps}
                        onClick={() => select(asset, true)}
                        onDelete={() => {
                          remove(asset);
                          toastSuccess('file', 'Xóa file thành công!', 'Đã xóa file ra khỏi trang!');
                        }}
                      />
                    </Col>
                  </div>
                ))}
              </Row>

              {/* <div className="grid grid-cols-6 gap-2 pt-2">
                {assets.map((asset) => (
                  <div
                    key={asset.getSrc()}
                    className="relative group rounded overflow-hidden"
                  >

                    <DemoImagePreview
                      {...sampleFileProps}
                      removeFile={() => remove(asset)}
                    />


                    <img className="display-block" src={asset.getSrc()} />

                    <div className="flex flex-col items-center justify-end absolute top-0 left-0 w-full h-full p-5 bg-zinc-700/75 group-hover:opacity-100 opacity-0 transition-opacity">
                      <button
                        type="button"
                        onClick={() => select(asset, true)}
                      >
                        Select
                      </button>
                      <div className="absolute top-2 right-2">

                        <Button type='text' icon={<FaTrash color='red' size={17} />} onClick={() => remove(asset)}></Button>
                      </div>

                    </div>
                  </div>
                ))}
              </div> */}
            </>,
          },
          {
            key: 'library',
            label: 'PHOTO LIBRARY',
            children: <>
              123
            </>,
          },
        ]}
      />
    </>

  );
}

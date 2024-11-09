import { useState } from 'react';
import { cx } from './common';
import { Button, Popconfirm, Tree, Typography } from 'antd';
import { FaTrash } from "react-icons/fa";

export default function CustomPageManager({
  pages,
  selected,
  add,
  select,
  remove,
}) {

  console.log(pages);


  const treeData = [
    {
      title: 'parent 1',
      key: '0-0',
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
          children: [
            {
              title: 'leaf',
              key: '0-0-0-0',
            },
            {
              title: 'leaf',
              key: '0-0-0-1',
            },
            {
              title: 'leaf',
              key: '0-0-0-2',
            },
          ],
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
          children: [
            {
              title: 'leaf',
              key: '0-0-1-0',
            },
          ],
        },
        {
          title: 'parent 1-2',
          key: '0-0-2',
          children: [
            {
              title: 'leaf',
              key: '0-0-2-0',
            },
            {
              title: 'leaf',
              key: '0-0-2-1',
            },
          ],
        },
      ],
    },
  ];

  const addNewPage = () => {
    const nextIndex = pages.length + 1;
    add({
      name: `New page ${nextIndex}`,
      component: `<h1>Page content ${nextIndex}</h1>`,
    });
  };

  return (
    <div className="gjs-custom-page-manager">
      <div className="p-2">
        <Button className='w-full mb-2' onClick={addNewPage}>Thêm trang mới</Button>

        <Tree
          showLine
          treeData={treeData}
        />
      </div>


      {/* {pages.map((page, index) => (
        <div
          key={page.getId()}
          className={cx(
            'flex items-center p-2 border-b', index === 0 && 'border-t',
          )}
        >
          {selected === page ? (
            <Typography.Link className="py-1 flex items-center flex-grow text-left" onClick={() => select(page)}>{page.getName() || 'Untitled page'}</Typography.Link>
          ) : (
            <Typography className="flex items-center flex-grow text-left" onClick={() => select(page)}>{page.getName() || 'Untitled page'}</Typography>
          )}

          {selected !== page && (
            <Popconfirm
              placement="left"
              title="Xóa Trang"
              description="Bạn có chắc chắn muốn xóa trang này?"
              onConfirm={() => remove(page)}
            >
              <Button className='!px-0 mx-0' icon={<FaTrash color='red' size={20} />}></Button>
            </Popconfirm>
          )}
        </div>
      ))} */}
    </div>
  );
}

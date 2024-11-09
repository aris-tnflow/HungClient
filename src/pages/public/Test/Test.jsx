import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Table } from 'antd';
import { getPageApi } from '~/redux/slices/Data/pagesSlice';

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
    },
];

const Row = (props) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props['data-row-key'] });
    const style = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        cursor: 'move',
        ...(isDragging
            ? {
                position: 'relative',
                zIndex: 9999,
            }
            : {}),
    };
    return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};

const App = () => {
    const dispatch = useDispatch();
    const { pages, loading } = useSelector((state) => state.pages);
    const dataPages = useMemo(() =>
        pages.map((page) => ({
            ...page,
            key: page._id,
        })),
        [pages]
    );

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 1 } }));
    const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
            const newDataSource = arrayMove(
                dataPages,
                dataPages.findIndex((i) => i.key === active.id),
                dataPages.findIndex((i) => i.key === over?.id)
            );

            // dispatch(updateDataSource(newDataSource));
            console.log(newDataSource);
        }
    };

    useEffect(() => {
        if (loading === true) {
            dispatch(getPageApi());
        }
    }, []);

    return (
        <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
            <SortableContext items={dataPages.map((i) => i.key)} strategy={verticalListSortingStrategy}>
                <Table
                    components={{
                        body: {
                            row: Row,
                        },
                    }}
                    rowKey="key"
                    columns={columns}
                    dataSource={dataPages}
                    loading={loading} // Hiển thị trạng thái loading nếu cần
                />
            </SortableContext>
        </DndContext>
    );
};

export default App;

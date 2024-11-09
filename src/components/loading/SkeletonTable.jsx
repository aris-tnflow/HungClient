import React from "react";
import { Skeleton, Table } from "antd";

const TableComp = ({ columns, data, isLoading }) => {
    const tableData = data?.map((item, index) => ({
        ...item,
        key: index + 1,
    }));

    return (
        <div>
            {isLoading ? (
                <Table
                    rowKey="key"
                    pagination={false}
                    dataSource={[...Array(9)].map((_, index) => ({
                        key: `key${index}`,
                    }))}
                    columns={columns.map((column) => ({
                        ...column,
                        render: function renderPlaceholder() {
                            return (
                                <Skeleton
                                    key={column.key}
                                    title
                                    active={true}
                                    paragraph={false}
                                />
                            );
                        },
                    }))}
                />
            ) : (
                <Table
                    rowKey="key"
                    dataSource={tableData}
                    columns={columns}
                />
            )}
        </div>
    );
};

export default TableComp;

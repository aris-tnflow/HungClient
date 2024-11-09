
import { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, DatePicker } from 'antd';
import Highlighter from 'react-highlight-words';

const { RangePicker } = DatePicker;

export const FilterText = ({ dataIndex, handleTableChange }) => {
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm) => {
        const searchValue = selectedKeys[0];
        confirm();
        if (handleTableChange && typeof handleTableChange === 'function') {
            handleTableChange({
                searchText: searchValue,
                searchedColumn: dataIndex
            });
        }
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        if (handleTableChange && typeof handleTableChange === 'function') {
            handleTableChange({
                searchText: '',
                searchedColumn: ''
            });
        }
    };

    return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder='Tìm kiếm'
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        onClick={() => {
                            clearFilters && handleReset(clearFilters);
                            confirm({ closeDropdown: true });
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Bỏ lọc
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Tìm kiếm
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    };
};

export const FilterDate = ({ dataIndex }) => {
    const [dateRange, setDateRange] = useState([]);
    const [searchedColumn, setSearchedColumn] = useState('');
    const rangePicker = useRef(null);

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setDateRange(selectedKeys);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setDateRange([]);
    };

    return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                className='flex flex-col justify-center'
                style={{ padding: 8, width: 300, }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <RangePicker
                    format={'DD-MM-YYYY'}
                    ref={rangePicker}
                    value={selectedKeys[0] || []}
                    onChange={(dates) => setSelectedKeys(dates ? [dates] : [])}
                    style={{ marginBottom: 8, }}
                />
                <Space className='flex justify-center'>
                    <Button
                        onClick={() => {
                            clearFilters && handleReset(clearFilters);
                            setTimeout(() => handleSearch(selectedKeys, confirm), 0);
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Trở về
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Tìm kiếm
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) => {
            if (!value || value.length !== 2) return false;
            const [startDate, endDate] = value;
            const recordDate = new Date(record[dataIndex]);
            return recordDate >= startDate && recordDate <= endDate;
        },
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => rangePicker.current?.focus(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[dateRange.join(' - ')]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    };
};

export const FilterSelect = (dataIndex, options) => {
    return {
        filters: options,
        onFilter: (value, record) => record[dataIndex] === value,
        filterSearch: true,
    };
};

export const FilterSelectArray = (dataIndex, options) => {
    return {
        filters: options,
        onFilter: (value, record) => {
            const isInArray = Array.isArray(record[dataIndex]) && record[dataIndex].includes(value);
            return isInArray;
        },
        filterSearch: true,
    };
};

export const FilterSorter = (dataIndex) => {
    return {
        sorter: (a, b) => {
            if (dataIndex.type == 'number') {
                return a[dataIndex.dataIndex] - b[dataIndex.dataIndex];
            } else {
                return a[dataIndex.dataIndex].length - b[dataIndex.dataIndex].length;
            }
        },
    };
};

// example
// ...FilterText({ dataIndex: 'address' }),
// ...FilterSorter('address'),
// ...FilterSelect('address', ['London', 'New York']),



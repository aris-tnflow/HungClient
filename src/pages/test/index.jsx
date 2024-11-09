import React, { useMemo, useRef, useState } from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { userApi } from '~/apis/userApi';

function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);
    const fetchRef = useRef(0);
    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);
            fetchOptions(value).then((newOptions) => {
                if (fetchId !== fetchRef.current) {
                    return;
                }
                setOptions(newOptions);
                setFetching(false);
            });
        };
        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);
    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
            options={options}
        />
    );
}

async function fetchUserList(email) {
    const response = await userApi.search({ email });
    return response?.newData?.map((user) => ({
        label: user.email,
        value: user._id,
    }));
}

const App = () => {
    const [value, setValue] = useState([]);
    return (
        <DebounceSelect
            mode="multiple"
            value={value}
            placeholder="Select users"
            fetchOptions={fetchUserList}
            onChange={(newValue) => {
                setValue(newValue);
            }}
            style={{
                width: '100%',
            }}
        />
    );
};
export default App;
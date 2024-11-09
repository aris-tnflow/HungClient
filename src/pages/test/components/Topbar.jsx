import React from 'react';
import { Select } from 'antd';
import { DevicesProvider, WithEditor } from '@grapesjs/react';

import TopbarButtons from './TopbarButtons';

const Topbar = ({ className }) => {
  return (
    <div className={`gjs-two-color flex items-center p-1 ${className}`}>
      <DevicesProvider>
        {({ selected, select, devices }) => (
          <Select
            value={selected}
            onChange={(value) => select(value)}
            style={{ width: 150 }}
          >
            {devices.map((device) => (
              <Select.Option value={device.id} key={device.id}>
                {device.getName()}
              </Select.Option>
            ))}
          </Select>
        )}
      </DevicesProvider>

      <WithEditor>
        <TopbarButtons className="ml-auto px-2" />
      </WithEditor>
    </div>
  );
};

export default Topbar;
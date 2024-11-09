import React, { useState } from 'react';
import { Tabs } from 'antd';
import { BlocksProvider, LayersProvider, PagesProvider, SelectorsProvider, StylesProvider, TraitsProvider } from '@grapesjs/react';

import { MAIN_BORDER_COLOR, cx } from './common';
import CustomBlockManager from './CustomBlockManager';
import CustomPageManager from './CustomPageManager';
import CustomLayerManager from './CustomLayerManager';
import CustomSelectorManager from './CustomSelectorManager';
import CustomStyleManager from './CustomStyleManager';
import CustomTraitManager from './CustomTraitManager';

import { HiViewGridAdd } from "react-icons/hi";
import { TbEdit } from "react-icons/tb";
import { IoSettings } from "react-icons/io5";
import { FaLayerGroup } from "react-icons/fa";
import { FaFileCirclePlus } from "react-icons/fa6";

export default function RightSidebar({ className }) {
  const [selectedTab, setSelectedTab] = useState('SelectorsProvider');

  return (
    <div className={cx('gjs-right-sidebar flex flex-col', className)}>
      <Tabs
        // className='h-[60px]'
        centered
        activeKey={selectedTab}
        onChange={(key) => setSelectedTab(key)}
        items={[
          {
            key: 'SelectorsProvider',
            icon: <TbEdit size={26} />,
          },
          {
            key: 'BlocksProvider',
            icon: <HiViewGridAdd size={25} />,
          },
          {
            key: 'CustomTraitManager',
            icon: <IoSettings size={24} />,
          },
          {
            key: 'CustomLayerManager',
            icon: <FaLayerGroup size={21} />,
          },
          {
            key: 'CustomPageManager',
            icon: <FaFileCirclePlus size={23} />,
          },
        ]}
      />

      <div className={cx('overflow-y-auto flex-grow')} style={{ height: 'calc(100% - 48px)' }}>
        {selectedTab === 'SelectorsProvider' && (
          <>
            <SelectorsProvider>
              {(props) => <CustomSelectorManager {...props} />}
            </SelectorsProvider>

            <StylesProvider>
              {(props) => <CustomStyleManager {...props} />}
            </StylesProvider>
          </>
        )}

        {selectedTab === 'BlocksProvider' && (
          <BlocksProvider>
            {(props) => <CustomBlockManager {...props} />}
          </BlocksProvider>
        )}

        {selectedTab === 'CustomTraitManager' && (
          <TraitsProvider>
            {(props) => <CustomTraitManager {...props} />}
          </TraitsProvider>
        )}

        {selectedTab === 'CustomLayerManager' && (
          <LayersProvider>
            {(props) => <CustomLayerManager {...props} />}
          </LayersProvider>
        )}

        {selectedTab === 'CustomPageManager' && (
          <PagesProvider>
            {(props) => <CustomPageManager {...props} />}
          </PagesProvider>
        )}
      </div>
    </div>
  );
}

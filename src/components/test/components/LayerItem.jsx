import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useEditor } from '@grapesjs/react';
// import { mdiEyeOffOutline, mdiEyeOutline, mdiMenuDown } from '@mdi/js';
// import Icon from '@mdi/react';
import { Button } from 'antd'; // Sử dụng Button của Ant Design để thay thế các nút từ MUI
import { MAIN_BORDER_COLOR, cx } from './common';

import { IoIosArrowDown } from "react-icons/io";

export default function LayerItem({
  component,
  draggingCmp,
  dragParent,
  level = 0,
  ...props
}) {
  const editor = useEditor();
  const { Layers } = editor;
  const layerRef = useRef(null);
  const [layerData, setLayerData] = useState(Layers.getLayerData(component));
  const { open, selected, hovered, components, visible, name } = layerData;
  const componentsIds = components.map(cmp => cmp.getId());
  const isDragging = draggingCmp === component;
  const cmpHash = componentsIds.join('-');
  const isHovered = hovered || dragParent === component;

  useEffect(() => {
    if (level === 0) setLayerData(Layers.getLayerData(component));
    if (layerRef.current) {
      layerRef.current.__cmp = component;
    }
  }, [component, level]);

  useEffect(() => {
    const updateLayerData = (cmp) => {
      if (cmp === component) setLayerData(Layers.getLayerData(cmp));
    };
    const event = Layers.events.component;
    editor.on(event, updateLayerData);

    return () => {
      editor.off(event, updateLayerData);
    };
  }, [editor, Layers, component]);

  const cmpToRender = useMemo(() => {
    return components.map(cmp => (
      <LayerItem
        key={cmp.getId()}
        component={cmp}
        level={level + 1}
        draggingCmp={draggingCmp}
        dragParent={dragParent}
      />
    ));
  }, [cmpHash, draggingCmp, dragParent, components, level]);

  const toggleOpen = (ev) => {
    ev.stopPropagation();
    Layers.setLayerData(component, { open: !open });
  };

  const toggleVisibility = (ev) => {
    ev.stopPropagation();
    Layers.setLayerData(component, { visible: !visible });
  };

  const select = (event) => {
    event.stopPropagation();
    Layers.setLayerData(component, { selected: true }, { event });
  };

  const hover = (hovered) => {
    if (!hovered || !draggingCmp) {
      Layers.setLayerData(component, { hovered });
    }
  };

  const wrapperCls = cx(
    'layer-item flex flex-col',
    selected && 'bg-sky-900',
    (!visible || isDragging) && 'opacity-50'
  );

  return (
    <div className={wrapperCls}>
      <div
        onClick={select}
        onMouseEnter={() => hover(true)}
        onMouseLeave={() => hover(false)}
        className="group max-w-full"
        data-layer-item
        ref={layerRef}
      >
        <div
          className={cx(
            'flex items-center p-1 pr-2 border-b gap-1',
            level === 0 && 'border-t',
            MAIN_BORDER_COLOR,
            // isHovered && 'bg-sky-700',
            // selected && 'bg-sky-500'
          )}
          style={{ backgroundColor: isHovered ? 'bg-sky-700' : selected ? 'bg-sky-500' : '' }}
        >
          <Button
            type="link"
            onClick={toggleOpen}
            style={{ marginLeft: `${level * 10}px` }}
            icon={'Open'}
            className={cx(
              'cursor-pointer',
              !components.length && 'pointer-events-none opacity-0'
            )}
          />
          <div className="truncate flex-grow" style={{ maxWidth: '100%' }}>
            {name}
          </div>
          <Button
            type="link"
            onClick={toggleVisibility}
            className={cx(
              'group-hover:opacity-100 cursor-pointer',
              visible ? 'opacity-0' : 'opacity-100'
            )}
            icon={<IoIosArrowDown />}
          />
        </div>
      </div>
      {open && components.length > 0 && (
        <div className={cx('max-w-full', !open && 'hidden')}>
          {cmpToRender}
        </div>
      )}
    </div>
  );
}

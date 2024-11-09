import React, { useEffect, useState } from 'react';
import { useEditor } from '@grapesjs/react';
import { Button } from 'antd';
import {
  BorderOutlined,
  FullscreenOutlined,
  CodeOutlined,
  UndoOutlined,
  RedoOutlined,
} from '@ant-design/icons';

const TopbarButtons = ({ className }) => {
  const editor = useEditor();
  const [, setUpdateCounter] = useState(0);
  const { UndoManager, Commands } = editor;

  const cmdButtons = [
    {
      id: 'core:component-outline',
      icon: <BorderOutlined />,
    },
    {
      id: 'core:fullscreen',
      icon: <FullscreenOutlined />,
      options: { target: '#root' },
    },
    {
      id: 'core:open-code',
      icon: <CodeOutlined />,
    },
    {
      id: 'core:undo',
      icon: <UndoOutlined />,
      disabled: () => !UndoManager.hasUndo(),
    },
    {
      id: 'core:redo',
      icon: <RedoOutlined />,
      disabled: () => !UndoManager.hasRedo(),
    },
  ];

  useEffect(() => {
    const cmdEvent = 'run stop';
    const updateEvent = 'update';
    const updateCounter = () => setUpdateCounter((value) => value + 1);
    const onCommand = (id) => {
      cmdButtons.find((btn) => btn.id === id) && updateCounter();
    };
    editor.on(cmdEvent, onCommand);
    editor.on(updateEvent, updateCounter);

    return () => {
      editor.off(cmdEvent, onCommand);
      editor.off(updateEvent, updateCounter);
    };
  }, []);

  return (
    <div className={`flex gap-3 ${className}`}>
      {cmdButtons.map(({ id, icon, disabled, options = {} }) => (
        <Button
          key={id}
          type={Commands.isActive(id) ? 'primary' : 'default'}
          icon={icon}
          onClick={() =>
            Commands.isActive(id)
              ? Commands.stop(id)
              : Commands.run(id, options)
          }
          disabled={disabled?.()}
        />
      ))}
    </div>
  );
};

export default TopbarButtons;
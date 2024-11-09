// Import React dependencies
import React, { useEffect, useState } from 'react';
import { useEditor } from '@grapesjs/react';
import { Button, Popconfirm, Modal } from 'antd';
import { MdOutlineHighlightAlt } from "react-icons/md";
import { RxEnterFullScreen } from "react-icons/rx";
import { FaCode } from "react-icons/fa6";
import { ImRedo, ImUndo } from "react-icons/im";
import { FaTrash } from 'react-icons/fa';

const TopbarButtons = ({ className }) => {
  const editor = useEditor();
  const [, setUpdateCounter] = useState(0);
  const { UndoManager, Commands } = editor;

  // State for Modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [codeContent, setCodeContent] = useState('');

  useEffect(() => {
    const cmdEvent = 'run stop';
    const updateEvent = 'update';
    const updateCounter = () => setUpdateCounter((value) => value + 1);
    const onCommand = (id) => {
      cmdButtons.find((btn) => btn.id === id) && updateCounter();
    };
    editor.on(cmdEvent, onCommand);
    editor.on(updateEvent, updateCounter);

    // Register custom command
    editor.Commands.add('custom:open-code-view', {
      run: () => {
        const html = editor.getHtml();
        const css = editor.getCss();
        const js = editor.getJs(); // Optional, if you have JS content
        const code = `<style>${css}</style>\n${html}\n<script>${js}</script>`;
        setCodeContent(code);
        setIsModalVisible(true);
      },
    });

    return () => {
      editor.off(cmdEvent, onCommand);
      editor.off(updateEvent, updateCounter);
    };
  }, []);

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const cmdButtons = [
    {
      id: 'core:component-outline',
      icon: <MdOutlineHighlightAlt size={20} />,
    },
    {
      id: 'core:fullscreen',
      icon: <RxEnterFullScreen size={20} />,
      options: { target: '#root' },
    },
    {
      id: 'custom:open-code-view', // Use the new custom command ID
      icon: <FaCode size={18} />,
    },
    {
      id: 'core:undo',
      icon: <ImUndo />,
      disabled: () => !UndoManager.hasUndo(),
    },
    {
      id: 'core:redo',
      icon: <ImRedo />,
      disabled: () => !UndoManager.hasRedo(),
    },
  ];

  return (
    <div className={`flex gap-3 ${className}`}>
      {cmdButtons.map(({ id, icon, disabled, options = {}, onClick }) => (
        <Button
          key={id}
          type={Commands.isActive(id) ? 'primary' : 'default'}
          icon={icon}
          onClick={() =>
            onClick
              ? onClick()
              : Commands.isActive(id)
                ? Commands.stop(id)
                : Commands.run(id, options)
          }
          disabled={disabled?.()}
        />
      ))}

      <Popconfirm
        title="Bạn có chắc chắn muốn xóa tất cả?"
        placement='bottomRight'
        onConfirm={() => {
          editor.DomComponents.clear();
          editor.CssComposer.clear();
          editor.UndoManager.clear();
        }}
      >
        <Button
          type="default"
          icon={<FaTrash />}
        />
      </Popconfirm>

      {/* Code View Modal */}
      <Modal
        title="Code View"
        open={isModalVisible}
        centered
        onCancel={handleModalClose}
        footer={null}
        width="80%"
      >
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {codeContent}
        </pre>
      </Modal>
    </div>
  );
};

export default TopbarButtons;


// import React, { useEffect, useState } from 'react';
// import { useEditor } from '@grapesjs/react';
// import { Button, Popconfirm } from 'antd';

// import { MdOutlineHighlightAlt } from "react-icons/md";
// import { RxEnterFullScreen } from "react-icons/rx";
// import { FaCode } from "react-icons/fa6";
// import { ImRedo, ImUndo } from "react-icons/im";
// import { FaTrash } from 'react-icons/fa';

// const TopbarButtons = ({ className }) => {
//   const editor = useEditor();
//   const [, setUpdateCounter] = useState(0);
//   const { UndoManager, Commands } = editor;

//   const cmdButtons = [
//     {
//       id: 'core:component-outline',
//       icon: <MdOutlineHighlightAlt size={20} />,
//     },
//     {
//       id: 'core:fullscreen',
//       icon: <RxEnterFullScreen size={20} />,
//       options: { target: '#root' },
//     },
//     {
//       id: 'core:open-code',
//       icon: <FaCode size={18} />,
//     },
//     {
//       id: 'core:undo',
//       icon: <ImUndo />,
//       disabled: () => !UndoManager.hasUndo(),
//     },
//     {
//       id: 'core:redo',
//       icon: <ImRedo />,
//       disabled: () => !UndoManager.hasRedo(),
//     },
//   ];

//   useEffect(() => {
//     const cmdEvent = 'run stop';
//     const updateEvent = 'update';
//     const updateCounter = () => setUpdateCounter((value) => value + 1);
//     const onCommand = (id) => {
//       cmdButtons.find((btn) => btn.id === id) && updateCounter();
//     };
//     editor.on(cmdEvent, onCommand);
//     editor.on(updateEvent, updateCounter);

//     return () => {
//       editor.off(cmdEvent, onCommand);
//       editor.off(updateEvent, updateCounter);
//     };
//   }, []);

//   return (
//     <div className={`flex gap-3 ${className}`}>
//       {cmdButtons.map(({ id, icon, disabled, options = {}, onClick }) => (
//         <Button
//           key={id}
//           type={Commands.isActive(id) ? 'primary' : 'default'}
//           icon={icon}
//           onClick={() =>
//             onClick
//               ? onClick()
//               : Commands.isActive(id)
//                 ? Commands.stop(id)
//                 : Commands.run(id, options)
//           }
//           disabled={disabled?.()}
//         />
//       ))}

//       <Popconfirm
//         title="Bạn có chắc chắn muốn xóa tất cả?"
//         placement='bottomRight'
//         onConfirm={() => {
//           editor.DomComponents.clear();
//           editor.CssComposer.clear();
//           editor.UndoManager.clear();
//         }}
//       >
//         <Button
//           type="default"
//           icon={<FaTrash />}
//         />
//       </Popconfirm>
//     </div>
//   );
// };

// export default TopbarButtons;

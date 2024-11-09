import React from 'react';
import { useEditor } from '@grapesjs/react';
import { Input, Select, Checkbox, Button } from 'antd';

const TraitPropertyField = ({ trait, ...rest }) => {
  const editor = useEditor();

  const handleChange = (value) => {
    trait.setValue(value);
  };

  const onChange = (ev) => {
    handleChange(ev.target.value);
  };

  const handleButtonClick = () => {
    const command = trait.get('command');
    if (command) {
      typeof command === 'string'
        ? editor.runCommand(command)
        : command(editor, trait);
    }
  };

  const type = trait.getType();
  const defValue = trait.getDefault() || trait.attributes.placeholder;
  const value = trait.getValue();
  const valueWithDef = typeof value !== 'undefined' ? value : defValue;

  let inputToRender = (
    <Input
      placeholder={defValue}
      value={value}
      onChange={onChange}
    />
  );

  switch (type) {
    case 'select': {
      inputToRender = (
        <Select
          value={value}
          onChange={handleChange}
          style={{ width: '100%' }}
        >
          {trait.getOptions().map((option) => (
            <Select.Option
              key={trait.getOptionId(option)}
              value={trait.getOptionId(option)}
            >
              {trait.getOptionLabel(option)}
            </Select.Option>
          ))}
        </Select>
      );
    } break;

    case 'color': {
      inputToRender = (
        <Input
          placeholder={defValue}
          value={value}
          onChange={(ev) => {
            handleChange(ev.target.value);
            console.log(ev.target.value);
          }}

          size="small"
          prefix={
            <div
              className="w-[15px] h-[15px] rounded border border-solid border-gray-300"
              style={{ backgroundColor: valueWithDef }}
            >
              <input
                type="color"
                className="w-[15px] h-[15px] cursor-pointer opacity-0"
                value={valueWithDef}
                onChange={(ev) => handleChange(ev.target.value)}
              />
            </div>
          }
        />
      );
    } break;

    case 'checkbox': {
      inputToRender = (
        <Checkbox
          checked={value}
          onChange={(ev) => trait.setValue(ev.target.checked)}
        />
      );
    }
      break;

    case 'button': {
      inputToRender = (<Button onClick={handleButtonClick}> {trait.getLabel()}</Button>)
    } break;

    // case 'input-file': {
    //   inputToRender = (
    //     <Select
    //       value={value}
    //       onChange={handleChange}
    //       style={{ width: '100%' }}
    //     >
    //       {trait.getOptions().map((option) => (
    //         <Select.Option
    //           key={trait.getOptionId(option)}
    //           value={trait.getOptionId(option)}
    //         >
    //           {trait.getOptionLabel(option)}
    //         </Select.Option>
    //       ))}
    //     </Select>
    //   );
    // } break;
  }

  return (
    <div {...rest} className="mb-3 px-1 w-full">
      <div className="flex mb-2 items-center">
        <div className="flex-grow capitalize">{trait.getLabel()}</div>
      </div>

      {inputToRender}
    </div>
  );
};

export default TraitPropertyField;
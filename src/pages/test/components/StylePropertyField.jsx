import React from 'react';
import { useEditor } from '@grapesjs/react';
import { Button, Radio, Select, Slider, Input, Space, ColorPicker } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';

const StylePropertyField = ({ prop, ...rest }) => {
  const handleChange = (value) => {
    prop.upValue(value);
  };

  const onChange = (ev) => {
    handleChange(ev.target.value);
  };

  const type = prop.getType();
  const defValue = prop.getDefaultValue();
  const canClear = prop.canClear();
  const hasValue = prop.hasValue();
  const value = prop.getValue();

  const valueString = hasValue ? value : '';
  const valueWithDef = hasValue ? value : defValue;

  let inputToRender = (
    <Input
      addonAfter={
        <>
          <Select
            options={[{
              label: 'px',
              value: 'px',
            }, {
              label: '%',
              value: '%',
            }, {
              label: 'em',
              value: 'em',
            }]}
          />
        </>
      }
      placeholder={defValue}
      value={valueString}
      onChange={onChange}
    />
  );

  switch (type) {
    case 'radio': {
      const radioProp = prop;
      inputToRender = (
        <Radio.Group value={value} onChange={onChange}>
          <Space>
            {radioProp.getOptions().map((option) => (
              <Radio.Button key={radioProp.getOptionId(option)} value={radioProp.getOptionId(option)}>
                {radioProp.getOptionLabel(option)}
              </Radio.Button>
            ))}
          </Space>
        </Radio.Group>
      );
    } break;

    case 'select': {
      const selectProp = prop;
      inputToRender = (
        <Select value={value} onChange={handleChange} size="small" style={{ width: '100%' }}>
          {selectProp.getOptions().map((option) => (
            <Select.Option key={selectProp.getOptionId(option)} value={selectProp.getOptionId(option)}>
              {selectProp.getOptionLabel(option)}
            </Select.Option>
          ))}
        </Select>
      );
    } break;

    case 'color': {
      inputToRender = (
        <Input
          placeholder={defValue}
          value={valueString}
          onChange={onChange}
          size="small"
          prefix={
            <div
              className="w-[15px] h-[15px] rounded-full border border-solid border-gray-300"
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

    case 'slider': {
      const sliderProp = prop;
      inputToRender = (
        <Slider
          value={parseFloat(value)}
          min={sliderProp.getMin()}
          max={sliderProp.getMax()}
          step={sliderProp.getStep()}
          onChange={handleChange}
          tooltip={{ formatter: (value) => `${value}` }}
        />
      );
    } break;

    case 'composite': {
      const compositeProp = prop;
      inputToRender = (
        <div className="flex flex-wrap p-2 bg-black/20 rounded border border-solid border-gray-300">
          {compositeProp.getProperties().map((prop) => (
            <StylePropertyField key={prop.getId()} prop={prop} />
          ))}
        </div>
      );
    } break;

    case 'stack': {
      const stackProp = prop;
      const layers = stackProp.getLayers();
      const isTextShadow = stackProp.getName() === 'text-shadow';

      inputToRender = (
        <div className="flex flex-col p-2 gap-2 bg-black/20 min-h-[54px] rounded border border-solid border-gray-300">
          {layers.map((layer) => (
            <div key={layer.getId()} className="border border-solid border-gray-300 rounded">
              <div className="flex gap-1 bg-slate-800 px-2 py-1 items-center">
                <Button
                  size="small"
                  icon={<ArrowUpOutlined />}
                  onClick={() => layer.move(layer.getIndex() - 1)}
                />
                <Button
                  size="small"
                  icon={<ArrowDownOutlined />}
                  onClick={() => layer.move(layer.getIndex() + 1)}
                />
                <Button type="text" className="flex-grow" onClick={() => layer.select()}>
                  {layer.getLabel()}
                </Button>

                <div
                  className="bg-white min-w-[17px] min-h-[17px] text-black text-sm flex justify-center rounded border border-solid border-gray-300"
                  style={layer.getStylePreview({
                    number: { min: -3, max: 3 },
                    camelCase: true,
                  })}
                >
                  {isTextShadow && 'T'}
                </div>
                <Button
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => layer.remove()}
                />
              </div>
              {layer.isSelected() && (
                <div className="p-2 flex flex-wrap">
                  {stackProp.getProperties().map((prop) => (
                    <StylePropertyField key={prop.getId()} prop={prop} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    } break;
  }

  return (
    <div {...rest} className={`mb-3 px-1 ${prop.isFull() ? 'w-full' : 'w-1/2'}`}>
      <div className={`flex h-[40px] items-center ${canClear ? 'text-sky-300' : ''}`}>
        <div className="flex-grow capitalize">{prop.getLabel()}</div>

        {canClear && (
          <Button className='!p-0 !m-0' type="text" danger onClick={() => prop.clear()} icon={<CloseOutlined />} />
        )}

        {type === 'stack' && (
          <Button
            size="small"
            className="ml-2"
            icon={<PlusOutlined />}
            onClick={() => prop.addLayer({}, { at: 0 })}
          />
        )}
      </div>
      {inputToRender}
    </div>
  );
};

export default StylePropertyField;
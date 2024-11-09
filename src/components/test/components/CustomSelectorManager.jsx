import React from 'react';
// import { mdiClose, mdiPlus } from '@mdi/js';
// import Icon from '@mdi/react';
import { Select, Button, Tag } from 'antd';
import { MAIN_BORDER_COLOR, cx } from './common';

const { Option } = Select;

export default function CustomSelectorManager({
  selectors,
  selectedState,
  states,
  targets,
  setState,
  addSelector,
  removeSelector,
}) {

  const addNewSelector = () => {
    const next = selectors.length + 1;
    addSelector({ name: `new-${next}`, label: `New ${next}` });
  };

  const targetStr = targets.join(', ');

  return (
    <div className="gjs-custom-selector-manager p-2 flex flex-col gap-2 text-left">
      <div className="flex items-center">
        <div className="flex-grow">Trạng thái</div>

        <Select
          value={selectedState}
          onChange={(value) => setState(value)}
          placeholder="- State -"
          style={{ width: 120 }}
          size="small"
        >
          {states.map((state) => (
            <Option value={state.id} key={state.id}>
              {state.getName()}
            </Option>
          ))}
        </Select>
      </div>
      <div
        className={cx(
          'flex items-center gap-2 flex-wrap p-2 bg-black/30 border rounded min-h-[45px]',
          MAIN_BORDER_COLOR
        )}
      >
        {targetStr ? (
          <Button
            type="dashed"
            onClick={addNewSelector}
            icon={"Close"}
          >
            Add Selector
          </Button>
        ) : (
          <div className="opacity-70">Select a component</div>
        )}
        {selectors.map((selector) => (
          <Tag
            key={selector.toString()}
            closable
            onClose={() => removeSelector(selector)}
            color="skyblue"
          >
            {selector.getLabel()}
          </Tag>
        ))}
      </div>

      <div>
        Selected: <span className="opacity-60">{targetStr || 'None'}</span>
      </div>
    </div>
  );
}

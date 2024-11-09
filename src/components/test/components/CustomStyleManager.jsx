import React from 'react';
import { Collapse, Button, Radio, Select, Slider, Input, Space } from 'antd';
import StylePropertyField from './StylePropertyField';

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
export default function CustomStyleManager({ sectors }) {
  return (
    <div className="gjs-custom-style-manager text-left">
      <Collapse
        accordion
        expandIconPosition="end"
        expandIcon={({ isActive }) => isActive ? <IoIosArrowDown size={18} /> : <IoIosArrowUp size={18} />}
      >
        {sectors.map((sector) => (
          <Collapse.Panel
            header={sector.getName()}
            key={sector.getId()}
            className="bg-slate-800"
          >
            <div className={`flex flex-wrap`}>

              {sector.getProperties().map((prop) => (
                <>
                  <StylePropertyField key={prop.getId()} prop={prop} />
                </>
              ))}
            </div>
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  );
}

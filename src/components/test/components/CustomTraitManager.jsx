import React from 'react';
import { Empty } from 'antd';
import TraitPropertyField from './TraitPropertyField';

export default function CustomTraitManager({ traits }) {
  return (
    <div className="gjs-custom-style-manager text-left mt-3 p-1">
      {
        !traits.length ?
          <Empty description="No properties available" />
          :
          traits.map(trait => (
            <TraitPropertyField key={trait.getId()} trait={trait} />
          ))}
    </div>
  );
}

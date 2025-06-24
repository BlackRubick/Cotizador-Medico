import React from 'react';
import Icon from '../../atoms/Icon';

const SocialButtons = () => (
  <div className="flex justify-center space-x-8 mt-8">
    <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
      <Icon type="microsoft" />
    </button>
    <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
      <Icon type="medical" />
    </button>
    <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
      <Icon type="shield" />
    </button>
  </div>
);

export default SocialButtons;

import { Tooltip } from 'antd';
import React from 'react';
import Icon from '@/components/Icon';

import './index.less';

export const Instruction = (props: {
  description: string;
  onClick?: () => void;
}) => (
  <Tooltip title={props.description} placement="top">
    <Icon
      icon="#iconhelp"
      className="icon-instruction"
      onClick={props.onClick}
    />
  </Tooltip>
);

export const TitleInstruction = (props: {
  title: string;
  description: string;
  onClick?: () => void;
}) => {
  const { title, ...rest } = props;
  return (
    <div className="instruction flex">
      <span>{title}</span>
      <Instruction {...rest} />
    </div>
  );
};

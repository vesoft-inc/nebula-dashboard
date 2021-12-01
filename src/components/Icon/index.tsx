import React, { SVGProps } from 'react';
import './index.less';

interface IProps extends SVGProps<any> {
  icon: string;
  className?: string;
}

const Icon = (props: IProps) => {
  const { icon, className, ...others } = props;
  return (
    <svg
      className={`dashboard-icon ${className || ''}`}
      aria-hidden="true"
      {...others}
    >
      <use xlinkHref={icon} />
    </svg>
  );
};

export default Icon;

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
      className={`dashboard-icon iconpark-icon ${className || ''}`}
      aria-hidden="true"
      {...others}
    >
      <use xlinkHref={icon} href={icon}/>
    </svg>
  );
};

export default Icon;

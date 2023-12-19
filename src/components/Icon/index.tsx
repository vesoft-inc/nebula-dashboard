import { SVGProps } from 'react';
import './index.less';

interface IProps extends SVGProps<any> {
  icon: string;
  className?: string;
  spin?: boolean;
}

const Icon = (props: IProps) => {
  const { icon, className, spin, ...others } = props;
  return (
    <svg
      className={`dashboard-icon iconpark-icon ${spin ? 'icon-spin': ''} ${className || ''}`}
      aria-hidden="true"
      {...others}
    >
      <use xlinkHref={icon} href={icon}/>
    </svg>
  );
};

export default Icon;

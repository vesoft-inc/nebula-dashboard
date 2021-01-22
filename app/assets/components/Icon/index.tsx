import React from 'react'
import './index.less'
interface IProps {
  icon: string;
  className?: string;
}
const Icon = (props: IProps) => {
  const { icon, className } = props 
  return (
    <svg className={`icon ${className ? className : ''}`} aria-hidden="true">
      <use xlinkHref={icon}></use>
    </svg>
  )
}

export default Icon
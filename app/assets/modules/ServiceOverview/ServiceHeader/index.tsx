import React from 'react'
import Icon from '@assets/components/Icon'
import './index.less'
interface IProps {
  title: string;
  icon: string;
  mode: string;
  displayMode: string;
  changeDisplayMode: (type: string) => void
}
class ServiceHeader extends React.PureComponent<IProps> {
  render() {
    const { title, icon, mode, displayMode, changeDisplayMode } = this.props;
    return (
      <div className="content-header">
        <div className="left">
          <Icon className={`icon-graph ${mode}`} icon={icon} />
          <span className="title">{title}</span>
        </div>
        <div className="right">
          <Icon className={displayMode === 'wrap' ? `btn-overview ${mode} active bg-${mode}` : `btn-overview ${mode}`} icon="#iconservice-slide-a" onClick={() => changeDisplayMode('wrap')} />
          <Icon className={displayMode === 'grid' ? `btn-display ${mode} active bg-${mode}` : `btn-display ${mode}`} icon="#iconservice-arrange-a" onClick={() => changeDisplayMode('grid')}  />
          <Icon className={`btn-enlarge ${mode}`} icon="#iconzoom" />
        </div>
      </div>
    )
  }
}

export default ServiceHeader
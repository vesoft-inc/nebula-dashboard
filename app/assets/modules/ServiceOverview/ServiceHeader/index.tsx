import React from 'react'
import Icon from '@assets/components/Icon'
import './index.less'
interface IProps {
  title: string;
  icon: string;
  mode: string;
  multipleMode: boolean;
  displayMode?: string;
  changeDisplayMode?: (type: string) => void
}
class ServiceHeader extends React.PureComponent<IProps> {
  handleClick = (value) => {
    if(this.props.changeDisplayMode) {
      this.props.changeDisplayMode(value);
    }
  }
  render() {
    const { title, icon, mode, displayMode, multipleMode } = this.props;
    return (
      <div className="content-header">
        <div className="left">
          <Icon className={`icon-graph ${mode}`} icon={icon} />
          <span className="title">{title}</span>
        </div>
        <div className="right">
          {multipleMode && <>
            <Icon className={displayMode === 'wrap' ? `btn-overview ${mode} active bg-${mode}` : `btn-overview ${mode}`} icon="#iconservice-slide-a" onClick={() => this.handleClick('wrap')} />
            <Icon className={displayMode === 'grid' ? `btn-display ${mode} active bg-${mode}` : `btn-display ${mode}`} icon="#iconservice-arrange-a" onClick={() => this.handleClick('grid')}  />
          </>}
          <Icon className={`btn-enlarge ${mode}`} icon="#iconzoom" />
        </div>
      </div>
    )
  }
}

export default ServiceHeader
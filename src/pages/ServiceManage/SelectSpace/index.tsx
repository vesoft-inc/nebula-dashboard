import React from 'react';
import { DashboardSelect, Option } from '@/components/DashboardSelect';
import { IDispatch, IRootState } from '@/store';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import styles from './index.module.less';

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncUseSpaces: dispatch.nebula.asyncUseSpaces,
  asyncGetSpaces: dispatch.nebula.asyncGetSpaces,
});

const mapState = (state: IRootState) => ({
  spaces: state.nebula.spaces,
});

interface IProps
  extends ReturnType<typeof mapState>,
    ReturnType<typeof mapDispatch> {
  onHide?: () => void;
}

class SelectSpace extends React.Component<IProps> {
  componentDidMount() {
    this.props.asyncGetSpaces();
  }

  handleSpaceChange = async space => {
    const { code } = await this.props.asyncUseSpaces(space);
    if (code === 0) {
      this.props.onHide?.();
    }
  };

  render() {
    const { spaces } = this.props;
    return (
      <div className={styles.space}>
        <DashboardSelect
          placeholder={intl.get('service.chooseSpace')}
          onChange={this.handleSpaceChange}
          style={{
            width: 220,
          }}
        >
          {spaces.map((space: any) => (
            <Option value={space.Name} key={space.Name}>
              {space.Name}
            </Option>
          ))}
        </DashboardSelect>
      </div>
    );
  }
}
export default connect(mapState, mapDispatch)(SelectSpace);

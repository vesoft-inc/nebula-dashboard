import { useEffect } from 'react';
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
  currentSpace: state.nebula.currentSpace,
});

interface IProps
  extends ReturnType<typeof mapState>,
    ReturnType<typeof mapDispatch> {
  onHide?: () => void;
  style?: any;
}

function SelectSpace(props: IProps) {
  const { asyncGetSpaces, asyncUseSpaces, spaces, style = {}, currentSpace, onHide } = props;
  
  useEffect(() => {
    asyncGetSpaces();
  }, [])

  const handleSpaceChange = async space => {
    const { code } = await asyncUseSpaces(space);
    if (code === 0) {
      onHide?.();
    }
  };

  return (
    <div className={styles.space} style={{...style}}>
      <DashboardSelect
        placeholder={intl.get('service.chooseSpace')}
        onChange={handleSpaceChange}
        style={{
          width: 220,
        }}
        value={currentSpace}
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
export default connect(mapState, mapDispatch)(SelectSpace);

import { Select } from 'antd';
import React from 'react';
import { INTL_LOCALE_SELECT } from '@/config';
import Icon from '@/components/Icon';
import './index.less';

const { Option } = Select;

interface IProps {
  mode?: string;
  showIcon?: boolean;
  currentLocale: string;
  toggleLanguage: (lang: string) => void;
}

export default class OutputCsv extends React.PureComponent<IProps> {
  render() {
    const { mode, showIcon, currentLocale, toggleLanguage } = this.props;
    return (
      <Select
        className={mode === 'dark' ? 'dark select-lang' : 'select-lang'}
        dropdownClassName={mode === 'dark' ? 'dark-options' : ''}
        size="middle"
        value={currentLocale}
        onChange={toggleLanguage}
        suffixIcon={<Icon icon="#iconnav-foldTriangle" />}
        showArrow={showIcon}
        optionLabelProp="label"
      >
        {Object.keys(INTL_LOCALE_SELECT).map(locale => (
          <Option
            className="dark"
            key={locale}
            value={INTL_LOCALE_SELECT[locale].NAME}
            label={
              <div className="select-label">
                {showIcon && <Icon icon="#iconnav-language" />}
                {INTL_LOCALE_SELECT[locale].TEXT}
              </div>
            }
          >
            {INTL_LOCALE_SELECT[locale].TEXT}
          </Option>
        ))}
      </Select>
    );
  }
}

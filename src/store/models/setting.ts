import { createModel } from '@rematch/core';
import _ from 'lodash';

interface IState {
  cpuBaseLine: number|undefined,
  diskBaseLine: number|undefined,
  memoryBaseLine: number|undefined,
  networkOutBaseLine: number|undefined,
  networkInBaseLine: number|undefined,
  loadBaseLine: number|undefined,
}

export const setting = createModel({
  state: {
    cpuBaseLine: undefined,
    diskBaseLine: undefined,
    memoryBaseLine: undefined,
    networkOutBaseLine: undefined,
    networkInBaseLine: undefined,
    loadBaseLine: undefined,
    networkBaseLine: undefined,
  },
  reducers: {
    update: (state: IState, payload: any) => {
      return {
        ...state,
        ...payload,
      };
    },
  },
});

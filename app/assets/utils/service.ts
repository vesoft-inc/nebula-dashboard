// TODO: define qps status threshold standard
export const QPSTHRESHOLDS = {
  LOW: 100,
  MEDIUM: 200,
};

export const SERVICE_QUERY_INTERVAL  = 10 * 60;
export const SERVICE_QUERY_STEP = 60;
export const BLUE_COLOR = {
  LINE: '#4372FF',
  AREA_TOP: 'rgba(67,114,255,1)',
  AREA_BOTTOM: 'rgba(67,114,255,0)'
};

export const PINK_COLOR = {
  LINE: '#EB2F96',
  AREA_TOP: 'rgba(235,47,150,1)',
  AREA_BOTTOM: 'rgba(67,114,255,0)'
};

export const SKYBLUE_COLOR = {
  LINE: '#0EBAD2',
  AREA_TOP: 'rgba(14,186,210,1)',
  AREA_BOTTOM: 'rgba(67,114,255,0)'
};

export const getStatus = (value: number) => {
  if (value < QPSTHRESHOLDS.LOW) {
    return 'NORMAL';
  } else if (value < QPSTHRESHOLDS.MEDIUM) {
    return 'OVERLOAD';
  } else {
    return 'ABNORMAL';
  }
};

export const getColors = (mode: string) => {
  if(mode === 'blue') {
    return BLUE_COLOR;
  } else if (mode === 'pink') {
    return PINK_COLOR;
  } else if (mode === 'skyblue') {
    return SKYBLUE_COLOR;
  } 
};

export const LINE_COLORS = [
  '#4372FF',
  '#EB2F96',
  '#0EBAD2',
  '#29C377',
  '#F5B60D',
  '#E25F5F',
  '#7B9CFF',
  '#55CFDE',
  '#F16DB5',
  '#67D39E',
  '#F6CA54',
  '#EB8E8E',
  '#B4C6FF',
  '#9CE3EB',
  '#F7ACD5',
  '#A6E4C5',
  '#F8DE9B',
  '#F4BCBC',
  '#BFBFBF',
  '#595959',
];

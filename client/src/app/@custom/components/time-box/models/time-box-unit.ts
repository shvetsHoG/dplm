export const TIME_BOX_UNIT: { [key: string]: TimeBoxUnit } = {
  Hour: {
    maxVal: 24 * 60 * 60,
    minVal: 60 * 60
  },
  Minute: {
    maxVal: 60 * 60,
    minVal: 60
  },
  Second: {
    maxVal: 60,
    minVal: 1
  }
};

interface TimeBoxUnit {
  maxVal: number;
  minVal: number;
}

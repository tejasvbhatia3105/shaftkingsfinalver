export const getColorByProbability = (probability: number): string => {
  switch (true) {
    case probability >= 0 && probability < 0.1:
      return '#DF28A1';
    case probability >= 0.1 && probability < 1:
      return '#DF28A1';
    case probability >= 1 && probability < 3:
      return '#FF5574';
    case probability >= 3 && probability < 10:
      return '#C499B6';
    case probability >= 10 && probability < 30:
      return '#74295C';
    case probability >= 30 && probability <= 100:
      return '#5C5F64';
    default:
      return '#5C5F64';
  }
};

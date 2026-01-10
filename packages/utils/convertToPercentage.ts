export function convertToPercentage(value: number): string {
  if (value < 1) {
    return '< 1%';
  }
  if (value >= 1 && value < 2) {
    return '> 1%';
  }

  return `${value.toFixed(0)}%`;
}

export function calculateLiquidityPercentage(
  liquidity: number,
  totalLiquidity: number
): number {
  if (liquidity === 0) {
    return 0;
  }

  return (liquidity / totalLiquidity) * 100;
}

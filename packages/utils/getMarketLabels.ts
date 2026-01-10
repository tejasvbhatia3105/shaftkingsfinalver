export const getMarketLabels = (
  marketId?: number
): { yesButton: string; noButton: string } => {
  switch (marketId) {
    case 1:
      return {
        yesButton: 'Kolkata Knight Riders',
        noButton: 'Royal Challengers Bengaluru',
      };
    case 2:
      return {
        yesButton: 'Sunrisers Hyderabad',
        noButton: 'Rajasthan Royals',
      };
    case 3:
      return { yesButton: 'Chennai Super Kings', noButton: 'Mumbai Indians' };
    default:
      // return { yesButton: 'Yes', noButton: 'No' };
      return { yesButton: 'Mumbai Indians', noButton: 'Sunrisers Hyderabad' };
  }
};

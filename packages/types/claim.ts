export interface ClaimVault {
  id: string;
  authority: string;
  initTs: string;
  endTs: string;
  totalAmount: string;
  totalClaimed: string;
  totalUsers: string;
  claimedUsers: string;
  tokenPerUser: string;
  mint: string;
  isActive: boolean;
  name: string;
  isFirstComeFirstServed: boolean;
  timestamp: string;
  claimedUser: {
    id: string;
    authority: string;
    claimVaultId: string;
    mint: string;
    amount: string;
    timestamp: string;
  }[];
  claimData: {
    id: string;
    authority: string;
    claimedVaultId: string;
    amount: string;
  }[];
}

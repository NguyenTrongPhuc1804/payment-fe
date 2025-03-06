export interface UserAuth {
  uid?: string;
  email?: string;
  getIdToken: () => Promise<string>;
}

export interface UserProfile extends Omit<UserAuth, "getIdToken"> {
  amount_balance?: number;
  total_paid?: number;
  total_pending?: number;
}

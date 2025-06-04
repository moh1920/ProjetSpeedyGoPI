export interface LoyaltyProgramDTO {
  id: number;
  partnerLoyaltyProgramId: string;
  customersLoyaltyProgramIds: string[];

  programName: string;
  description: string;
  startDate: Date;
  endDate: Date;
  pointsAccumulated: number;
  rewardType: string;
  membershipCondition: string;
  isActive: boolean;
  promoCode: string;

  usersWhoWonPointsEmails: string[];
  usersWhoWonSpecialPromotionsEmails: string[];
}


interface ChartData {
  name: string;
  value: number;
  color: string;
}

/**
 * Generates mock claims data for demonstration purposes
 * @returns Object containing injury and death claims mock data
 */
export const generateMockClaimsData = () => {
  const mockInjuryData: ChartData[] = [
    { name: "Pending", value: 45, color: "#9ca360" },
    { name: "Approved", value: 30, color: "#64805E" },
    { name: "Rejected", value: 15, color: "#8B2303" },
  ];
  
  const mockDeathData: ChartData[] = [
    { name: "Pending", value: 20, color: "#5ED0C0" },
    { name: "Approved", value: 15, color: "#30D158" },
    { name: "Rejected", value: 5, color: "#FF9F0A" },
  ];
  
  return {
    injuryClaims: mockInjuryData,
    deathClaims: mockDeathData
  };
};

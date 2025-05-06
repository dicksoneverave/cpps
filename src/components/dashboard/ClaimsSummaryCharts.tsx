
import React from "react";
import ClaimsChart from "../dashboards/ClaimsCharts";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface ClaimsSummaryChartsProps {
  injuryClaims: ChartData[];
  deathClaims: ChartData[];
}

const ClaimsSummaryCharts: React.FC<ClaimsSummaryChartsProps> = ({
  injuryClaims,
  deathClaims
}) => {
  const injuryChartConfig = {
    pending: { color: "#9ca360" },
    approved: { color: "#64805E" },
    rejected: { color: "#8B2303" },
  };

  const deathChartConfig = {
    pending: { color: "#5ED0C0" },
    approved: { color: "#30D158" },
    rejected: { color: "#FF9F0A" },
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <ClaimsChart
        claimData={injuryClaims}
        title="Claims for Injury this year"
        description="Distribution of injury claims by status"
        colorConfig={injuryChartConfig}
      />
      
      <ClaimsChart
        claimData={deathClaims}
        title="Claims for Death this year"
        description="Distribution of death claims by status"
        colorConfig={deathChartConfig}
      />
    </div>
  );
};

export default ClaimsSummaryCharts;

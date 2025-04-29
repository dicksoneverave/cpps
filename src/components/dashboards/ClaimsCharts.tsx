
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Legend } from "recharts";

interface ClaimsChartProps {
  claimData: {
    name: string;
    value: number;
    color: string;
  }[];
  title: string;
  description: string;
  colorConfig: Record<string, { color: string }>;
}

const ClaimsChart: React.FC<ClaimsChartProps> = ({
  claimData,
  title,
  description,
  colorConfig
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ChartContainer config={colorConfig}>
          <PieChart>
            <Pie
              data={claimData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {claimData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ClaimsChart;

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import {  useState } from "react";

const SpendingChart = ({ data}) => {
const [spending, setSpending] =
  useState([]);
  return (
    <ResponsiveContainer
      width="100%"
      height={350}
    >
      <BarChart data={data}>

        <CartesianGrid
          strokeDasharray="3 3"
        />

        <XAxis dataKey="month" />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="totalSpend"
        />

      </BarChart>
    </ResponsiveContainer>
  );

};

export default SpendingChart;
import { TrendingUp, BarChart3, PieChart as PieIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import type { ProductsApiResponse } from "@/lib/types";
import { useTheme } from "next-themes";

const generateMonthlyRevenue = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months.map((month) => ({
    name: month,
    revenue: Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000,
  }));
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4560",
];

export default function AnalyticsPage() {
  const { theme } = useTheme();

  const {
    data: analyticsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", "all", "analytics"],
    queryFn: fetchAllProducts,
    select: (data: ProductsApiResponse) => {
      const categoryCounts = data.products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      let categoryDistribution = Object.entries(categoryCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      const MAX_CATEGORIES = 6;
      if (categoryDistribution.length > MAX_CATEGORIES) {
        const top = categoryDistribution.slice(0, MAX_CATEGORIES - 1);
        const other = categoryDistribution.slice(MAX_CATEGORIES - 1);
        const otherTotal = other.reduce((sum, c) => sum + c.value, 0);

        categoryDistribution = [...top, { name: "Other", value: otherTotal }];
      }

      const brandStockValue = data.products
        .filter((product) => product.brand)
        .reduce((acc, product) => {
          const value = product.price * product.stock;
          acc[product.brand!] = (acc[product.brand!] || 0) + value;
          return acc;
        }, {} as Record<string, number>);

      const topBrands = Object.entries(brandStockValue)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

      const monthlyRevenue = generateMonthlyRevenue();

      return { categoryDistribution, topBrands, monthlyRevenue };
    },
  });

  const axisColor = theme === "dark" ? "#94a3b8" : "#64748b";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-destructive py-10">
        Failed to load analytics data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue Trends
            </CardTitle>
            <CardDescription>
              Monthly revenue performance (synthesized data)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analyticsData?.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} stroke={axisColor} />
                <YAxis
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                  stroke={axisColor}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value) => [
                    `$${(value as number).toFixed(2)}`,
                    "Revenue",
                  ]}
                />
                <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-primary" />
              Category Distribution
            </CardTitle>
            <CardDescription>Product count by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analyticsData?.categoryDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="35%"
                  cy="50%"
                  outerRadius={70}
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {analyticsData?.categoryDistribution.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value, name) => [value, name]}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconSize={10}
                  wrapperStyle={{
                    fontSize: "12px",
                    lineHeight: "20px",
                    color: "hsl(var(--foreground))",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Top Brands by Stock Value
          </CardTitle>
          <CardDescription>
            Total value of on-hand stock for the top 10 brands
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={analyticsData?.topBrands}>
              <XAxis
                dataKey="name"
                stroke={axisColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke={axisColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${(value as number) / 1000}k`}
              />
              <Tooltip
                cursor={{ fill: "#87CEEB" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value) => [
                  `$${(value as number).toFixed(2)}`,
                  "Stock Value",
                ]}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

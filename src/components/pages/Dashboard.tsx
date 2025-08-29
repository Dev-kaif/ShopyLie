import { Package, DollarSign, Archive, Shapes } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard, StatCardSkeleton } from "@/components/statCard";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/lib/api";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { type ProductsApiResponse } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", "all", "analytics"],
    queryFn: fetchAllProducts,
    select: (data: ProductsApiResponse) => {

      // Calculate Total Stock Value
      const totalStockValue = data.products.reduce((acc, product) => {
        return acc + product.price * product.stock;
      }, 0);

      // Count Products Out of Stock
      const outOfStockCount = data.products.filter((p) => p.stock === 0).length;

      // Count Unique Categories
      const categorySet = new Set(data.products.map((p) => p.category));
      const categoryCount = categorySet.size;

      // Prepare Chart Data
      const stockByCategory = data.products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + product.stock;
        return acc;
      }, {} as Record<string, number>);

      const chartData = Object.entries(stockByCategory)
        .map(([name, stock]) => ({ name, stock }))
        .sort((a, b) => b.stock - a.stock);

      return {
        totalProducts: data.total,
        totalStockValue,
        outOfStockCount,
        categoryCount,
        chartData,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Stock Levels by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-destructive py-10">
        Error: Could not fetch or process dashboard data.
      </div>
    );
  }

  const stats = [
    {
      title: "Total Products",
      value: dashboardData?.totalProducts,
      icon: Package,
    },
    {
      title: "Total Stock Value",
      value: dashboardData?.totalStockValue,
      prefix: "$",
      icon: DollarSign,
    },
    {
      title: "Out of Stock",
      value: dashboardData?.outOfStockCount,
      icon: Archive,
    },
    { title: "Categories", value: dashboardData?.categoryCount, icon: Shapes },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value ?? 0}
            icon={stat.icon}
            prefix={stat.prefix}
          />
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Stock Levels by Category</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={dashboardData?.chartData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "#87CEEB" }}
                contentStyle={{ backgroundColor: "hsl(var(--background))" }}
              />
              <Bar
                dataKey="stock"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-blue-500 dark:fill-blue-400"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

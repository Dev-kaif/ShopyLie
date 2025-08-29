import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Cart } from "@/lib/types";

const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const getRandomStatus = () =>
  statuses[Math.floor(Math.random() * statuses.length)];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Shipped":
    case "Delivered":
      return (
        <Badge variant="secondary" className="bg-green-500/20 text-green-600">
          {status}
        </Badge>
      );
    case "Processing":
      return (
        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">
          {status}
        </Badge>
      );
    case "Cancelled":
      return <Badge variant="destructive">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function OrdersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const LoadingRow = () => (
    <TableRow>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableCell key={i}>
          <Skeleton className="h-6" />
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Order ID</TableHead>
              <TableHead>Customer ID</TableHead>
              <TableHead># of Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => <LoadingRow key={i} />)
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-destructive"
                >
                  Failed to load orders. Please try again.
                </TableCell>
              </TableRow>
            ) : (
              data?.carts.map((order: Cart) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>User #{order.userId}</TableCell>
                  <TableCell>{order.totalProducts}</TableCell>
                  <TableCell>{getStatusBadge(getRandomStatus())}</TableCell>
                  <TableCell className="text-right font-semibold">
                    ${order.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

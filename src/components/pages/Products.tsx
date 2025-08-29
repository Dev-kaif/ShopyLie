import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  Filter,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  fetchCategories,
} from "@/lib/api";
import {
  type Product,
  type ProductsApiResponse,
  type AddProductData,
} from "@/lib/types";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { ProductDetailSheet } from "@/components/ProductDetails";

export default function ProductsPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const queryKey = [
    "products",
    { page, searchTerm: debouncedSearchTerm, category },
  ];

  const productsQuery = useQuery({
    queryKey,
    queryFn: () => fetchProducts({ pageParam: page, queryKey }),
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const addMutation = useMutation<Product, Error, AddProductData>({
    mutationFn: addProduct,
    onSuccess: (newProduct) => {
      toast.success(`Product "${newProduct.title}" added!`);
      queryClient.setQueryData<ProductsApiResponse | undefined>(
        queryKey,
        (oldData) =>
          oldData
            ? {
                ...oldData,
                products: [newProduct, ...oldData.products.slice(0, 9)],
              }
            : oldData
      );
    },
    onError: (error) => toast.error(`Failed to add product: ${error.message}`),
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: (updatedProduct) => {
      toast.success(`Product "${updatedProduct.title}" updated!`);
      queryClient.setQueryData<ProductsApiResponse | undefined>(
        queryKey,
        (oldData) =>
          oldData
            ? {
                ...oldData,
                products: oldData.products.map((p) =>
                  p.id === updatedProduct.id ? updatedProduct : p
                ),
              }
            : oldData
      );
    },
    onError: (error) =>
      toast.error(`Failed to update product: ${error.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (deletedProduct) => {
      toast.success(`Product deleted!`);
      queryClient.setQueryData<ProductsApiResponse | undefined>(
        queryKey,
        (oldData) =>
          oldData
            ? {
                ...oldData,
                products: oldData.products.filter(
                  (p) => p.id !== deletedProduct.id
                ),
              }
            : oldData
      );
    },
    onError: (error) =>
      toast.error(`Failed to delete product: ${error.message}`),
  });

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsSheetOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsSheetOpen(true);
  };

  const getStatusBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (stock < 10)
      return (
        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">
          Low Stock
        </Badge>
      );
    return (
      <Badge variant="secondary" className="bg-green-500/20 text-green-600">
        In Stock
      </Badge>
    );
  };

  const LoadingRow = () => (
    <TableRow>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableCell key={i}>
          <Skeleton className="h-6" />
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value);
              setPage(0);
            }}
          >
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoriesQuery.isLoading ? (
                <p className="p-2 text-sm text-muted-foreground">Loading...</p>
              ) : (
                categoriesQuery.data?.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddProduct}>
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsQuery.isLoading ? (
              Array.from({ length: 10 }).map((_, i) => <LoadingRow key={i} />)
            ) : productsQuery.isError ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-destructive">
                  Failed to load products.
                </TableCell>
              </TableRow>
            ) : productsQuery.data?.products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              productsQuery.data?.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="h-12 w-12 object-cover rounded-lg"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{product.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {product.brand || "No Brand"}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(product.stock)}</TableCell>
                  <TableCell className="text-right font-mono">
                    {product.stock}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{product.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(product.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <span className="text-sm text-muted-foreground">
          Page {page + 1} of{" "}
          {productsQuery.data ? Math.ceil(productsQuery.data.total / 10) : 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((old) => Math.max(old - 1, 0))}
          disabled={page === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setPage((old) =>
              productsQuery.data && (old + 1) * 10 < productsQuery.data.total
                ? old + 1
                : old
            )
          }
          disabled={
            !productsQuery.data || (page + 1) * 10 >= productsQuery.data.total
          }
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <ProductDetailSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        product={selectedProduct}
        addMutation={addMutation}
        updateMutation={updateMutation}
      />
    </div>
  );
}

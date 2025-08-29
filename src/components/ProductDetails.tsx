import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type Product,
  type AddProductData,
  AddProductSchema,
} from "@/lib/types";
import { type UseMutationResult } from "@tanstack/react-query";
import { z } from "zod";

interface ProductDetailSheetProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addMutation: UseMutationResult<Product, Error, AddProductData>;
  updateMutation: UseMutationResult<Product, Error, Product>;
}

type ProductFormData = z.infer<typeof AddProductSchema>;

export function ProductDetailSheet({
  product,
  open,
  onOpenChange,
  addMutation,
  updateMutation,
}: ProductDetailSheetProps) {
  const isEditing = !!product;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: {
      title: "",
      brand: "",
      price: 0,
      stock: 0,
      category: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (product) {
        form.reset(product);
      } else {
        form.reset({
          title: "",
          brand: "",
          price: 0,
          stock: 0,
          category: "",
          description: "",
        });
      }
    }
  }, [product, open, form]);

  const onSubmit = (data: ProductFormData) => {
    if (isEditing && product) {
      updateMutation.mutate({ ...product, ...data });
    } else {
      addMutation.mutate(data);
    }
    onOpenChange(false);
  };

  const mutationInProgress = addMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-xl">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle>
            {isEditing ? "Edit Product" : "Add New Product"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update product details."
              : "Fill in the details for the new product."}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="product-form"
            className="px-6 py-8 space-y-8"
          >
            <div>
              <Label htmlFor="title" className="mb-2 block">
                Product Name
              </Label>
              <Input
                id="title"
                {...form.register("title")}
                disabled={mutationInProgress}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="brand" className="mb-2 block">
                Brand
              </Label>
              <Input
                id="brand"
                {...form.register("brand")}
                disabled={mutationInProgress}
              />
              {form.formState.errors.brand && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.brand.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="price" className="mb-2 block">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...form.register("price", { valueAsNumber: true })}
                  disabled={mutationInProgress}
                />
                {form.formState.errors.price && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.price.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="stock" className="mb-2 block">
                  Stock
                </Label>
                <Input
                  id="stock"
                  type="number"
                  {...form.register("stock", { valueAsNumber: true })}
                  disabled={mutationInProgress}
                />
                {form.formState.errors.stock && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.stock.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="category" className="mb-2 block">
                Category
              </Label>
              <Input
                id="category"
                {...form.register("category")}
                disabled={mutationInProgress}
              />
              {form.formState.errors.category && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.category.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="description" className="mb-2 block">
                Description
              </Label>
              <Textarea
                id="description"
                {...form.register("description")}
                disabled={mutationInProgress}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
          </form>
        </div>
        <Separator />
        <SheetFooter className="px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutationInProgress}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="product-form"
            disabled={mutationInProgress}
          >
            {mutationInProgress ? "Saving..." : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

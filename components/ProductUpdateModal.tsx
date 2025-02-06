"use client";

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProductService from "@/services/ProductService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: number;
}

export function ProductUpdateModal({ isOpen, onClose, id }: ProfileUpdateModalProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await ProductService.getCategories();
        setCategories(data);
      } catch {
        setError("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData: any = {};
    if (title) updatedData.title = title;
    if (price !== "" && !isNaN(Number(price))) updatedData.price = Number(price);
    if (description) updatedData.description = description;
    if (categoryId) updatedData.categoryId = categoryId;
    if (image) updatedData.images = [image];

    if (Object.keys(updatedData).length === 0) {
      setError("One or more fields need to be changed.");
      return;
    }
  
    setLoading(true);

    try {
      await ProductService.updateProduct(id, updatedData);
      router.refresh();
      onClose();
    } catch (error) {
      setError("Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Product</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit Product</DialogTitle> 
        <div className="container mx-auto mt-10 flex justify-center">
          <Card className="max-w-lg w-full shadow-lg p-6">
            <CardHeader>
              <CardTitle className="text-center text-xl">Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Product Title"
                  />
                </div>

                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="Price"
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select onValueChange={(value) => setCategoryId(Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Description</Label>
                  <Input
                    type="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Product Description"
                  />
                </div>

                <div>
                  <Label>Image URL</Label>
                  <Input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Image URL"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Adding..." : "Add Product"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

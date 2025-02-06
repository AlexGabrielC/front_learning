"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductService from "@/services/ProductService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddProductPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !categoryId || !image || !description) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);

    try {
      await ProductService.createProduct({
        title,
        price: Number(price),
        description,
        categoryId,
        images: [image],
      });
      router.push("/products");
    } catch {
      setError("Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
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

          <form onSubmit={handleSubmit} className="space-y-4">
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
  );
}

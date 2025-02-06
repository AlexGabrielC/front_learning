"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductService from "@/services/ProductService";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ProductUpdateModal } from "@/components/ProductUpdateModal";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: {
    name: string;
    image: string;
  };
}

const Loader = () => (
    <div className="flex justify-center items-center h-16">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await ProductService.getProductById(Number(id));
        setProduct(data);
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await ProductService.deleteProduct(Number(id));
      router.push("/products"); // Redirect after successful deletion
    } catch (err) {
      setError("Failed to delete product.");
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 flex justify-center">
      <Card className="max-w-3xl w-full shadow-lg rounded-lg p-6">
        <CardHeader className="flex flex-col items-center">
          {product && product.images.length > 1 ? (
            <Carousel className="w-full max-w-md">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={image || "/default-product.png"}
                      alt={product.title}
                      onError={(e) => (e.currentTarget.src = "/default-product.png")}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <img
              src={product?.images[0]}
              alt={product?.title}
              className="w-72 h-72 object-cover rounded-md"
            />
          )}
          <CardTitle className="text-2xl font-semibold mt-4">{product?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 text-lg">{product?.description}</p>
          <p className="text-xl font-bold text-blue-500 mt-4">${product?.price}</p>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => router.push(`/products`)}>Back to Products</Button>
            <ProductUpdateModal isOpen={true} onClose={() => {}} id={Number(id)} />
            <Button variant="destructive" onClick={() => setDeleteModalOpen(true)}>Delete</Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this product? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
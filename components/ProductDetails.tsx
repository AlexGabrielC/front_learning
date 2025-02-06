"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductService from "@/services/ProductService";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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
                      src={image}
                      alt={`Product Image ${index + 1}`}
                      className="w-full h-72 object-cover rounded-md"
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
            <Button variant="outline">Back to Products</Button>
            <Button>Add to Cart</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

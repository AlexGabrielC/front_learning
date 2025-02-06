"use client";

import { useEffect, useState, useCallback } from "react";
import ProductService from "@/services/ProductService";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from "@/components/ui/pagination";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import ProductFilters from "./ProductFilters";

interface Product {
  id: number;
  title: string;
  price: number;
  images: string[];
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [pass, setPass] = useState(10);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(1);
  const [filters, setFilters] = useState({});

  const fetchProducts = useCallback(async () => {
    try {
      const fetchedProducts = await ProductService.getAllProducts(offset, limit, filters);
    setProducts(fetchedProducts);
    } catch (err) {
      setError("Failed to load products.");
    }
  }, [offset, limit, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleNextPage = () => {
    if (offset + pass < products.length+1) {
      setOffset(offset + pass);
      setLimit(limit + pass);
      setCount(count+1);
    }
  };

  const handlePreviousPage = () => {
    if (offset - pass >= 0) {
      setOffset(offset - pass);
      setLimit(limit - pass);
      setCount(count-1);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setOffset(0); // Reset pagination on new filter application
    setCount(1);
  };

  return (
    <div className="container mx-auto my-10">
      <h2 className="text-3xl font-bold text-center mb-6">Product List</h2>

      <ProductFilters onFilter={handleFilterChange} />

      {/* Sélecteur de nombre de produits par page */}
      <div className="flex justify-end mb-4">
        <Select onValueChange={(value) => setPass(parseInt(value))} defaultValue="10">
          <SelectTrigger className="w-32">
            <span>Show {pass}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Affichage des produits */}
      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="shadow-lg rounded-lg p-4">
              <CardHeader>
                <img
                  src={product.images[0] || "/default-product.png"}
                  alt={product.title}
                  onError={(e) => (e.currentTarget.src = "/default-product.png")}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg font-semibold">{product.title}</CardTitle>
                <p className="text-blue-500 font-bold mt-2">${product.price}</p>
                <Button className="mt-4 w-full" variant="outline">
                  View Product
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={handlePreviousPage} className={offset === 0 ? "opacity-50 pointer-events-none" : ""} />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink>{count}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              {offset + limit < products.length+1 ? (
                <PaginationNext onClick={handleNextPage} />
              ) : (
                <PaginationNext onClick={handleNextPage} className="opacity-50 pointer-events-none" />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

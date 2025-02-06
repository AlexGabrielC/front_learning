import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductService from "@/services/ProductService";

const ProductFilters = ({ onFilter }: { onFilter: (filters: any) => void }) => {
  const [title, setTitle] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await ProductService.getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleApplyFilters = () => {
    const filters: any = {};
    if (title) filters.title = title;
    if (priceMin) filters.price_min = priceMin;
    if (priceMax) filters.price_max = priceMax;
    if (categoryId) filters.categoryId = categoryId;

    onFilter(filters);
  };

  const handleResetFilters = () => {
    setTitle("");
    setPriceMin("");
    setPriceMax("");
    setCategoryId(null);
    onFilter({});
  };

  return (
    <div className="flex space-x-2 mb-4">
      <Input
        placeholder="Search title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        placeholder="Min Price"
        type="number"
        value={priceMin}
        onChange={(e) => setPriceMin(e.target.value)}
      />
      <Input
        placeholder="Max Price"
        type="number"
        value={priceMax}
        onChange={(e) => setPriceMax(e.target.value)}
      />
      <Select value={categoryId ? String(categoryId) : ""} onValueChange={(value) => setCategoryId(Number(value))}>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={String(category.id)}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleApplyFilters}>Apply Filters</Button>
      <Button onClick={handleResetFilters} variant="outline">
        Reset Filters
      </Button>
    </div>
  );
};

export default ProductFilters;

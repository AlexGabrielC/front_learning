import axios, { AxiosResponse } from "axios";

const API_URL = "https://api.escuelajs.co/api/v1";

const isValidImageUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

const transformProductData = (product: any) => {
  const parsedImages = product.images.map((img: string) => {
    try {
      let urls = JSON.parse(img); // Essayer de parser si format JSON stringifié
      
      if (Array.isArray(urls) && urls.length > 0) {
        const validUrl = isValidImageUrl(urls[0]) ? urls[0] : "/default-product.png";
        return validUrl;
      }
    } catch (error) {
      console.log("JSON parsing failed for:", img);
    }

    const finalUrl = isValidImageUrl(img) ? img : "/default-product.png";
    return finalUrl;
  });

  return {
    ...product,
    images: parsedImages,
  };
};

const ProductService = {
  getAllProducts: async (offset: number, limit: number, filters: any = {}) => {
    try {
      console.log("Offset:", offset, "Limit:", limit, "Filters:", filters);

      const params: any = { offset, limit, ...filters };
      const response = await axios.get(`${API_URL}/products`, { params });
      return response.data.map(transformProductData);
    } catch (error) {
      throw new Error("Failed to fetch products");
    }
  },

  getProductById: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return transformProductData(response.data);
    } catch (error) {
      throw new Error("Error fetching product");
    }
  },

  createProduct: async (productData: {
    title: string;
    price: number;
    description: string;
    categoryId: number;
    images: string[];
  }) => {
    try {
      const response = await axios.post(`${API_URL}/products/`, productData);
      return response.data;
    } catch (error) {
      throw new Error("Error creating product");
    }
  },

  updateProduct: async (id: number, updatedData: Partial<{ 
      title: string;
      price: number;
      description: string;
      categoryId: number;
      images: string[]; 
  }>) => {
    try {
      const response = await axios.put(`${API_URL}/products/${id}`, updatedData);
      return response.data;
    } catch (error) {
      throw new Error("Error updating product");
    }
  },

  deleteProduct: async (id: number) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      return true;
    } catch (error) {
      throw new Error("Error deleting product");
    }
  },

  getCategories: async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch categories");
    }
  },

  getCategoryById: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/categories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Category not found");
    }
  },

  createCategory: async (categoryData: { name: string; image: string }) => {
    try {
      const response = await axios.post(`${API_URL}/categories`, categoryData);
      return response.data;
    } catch (error) {
      throw new Error("Failed to create category");
    }
  },

  updateCategory: async (id: number, updateData: Partial<{ name: string }>) => {
    try {
      const response = await axios.put(`${API_URL}/categories/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error("Failed to update category");
    }
  },

  deleteCategory: async (id: number) => {
    try {
      await axios.delete(`${API_URL}/categories/${id}`);
      return true;
    } catch (error) {
      throw new Error("Failed to delete category");
    }
  },

  getProductsByCategory: async (categoryId: number) => {
    try {
      const response = await axios.get(`${API_URL}/categories/${categoryId}/products`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch products for this category");
    }
  },
};

export default ProductService;

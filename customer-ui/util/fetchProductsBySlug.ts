
import axios from "axios";
import { Product } from "@/types";
import { slugify } from "./slugify";
import axiosInstance from "@/api/axiosInstance";


export async function fetchProductBySlug(slug: string) {
    try {
      const response = await axiosInstance.get("/products/get-products");
      const products = response.data.data.products.map(processProductData);
      
      const product = products.find((p: { slug: string; }) => p.slug === slug);
      return product || null;
    } catch (error) {
      console.error("Failed to fetch product by slug:", error);
      return null;
    }
  }

export function processProductData(product: any) {
  return {
    ...product,
    slug: slugify(product.title_en),
    price: (product.price / 100).toFixed(2),

    ingredients_en: product.ingredients_en.map((ingredient: any) => ({
      ...ingredient,
      options: ingredient.options[0].split(',').map((opt: string) => opt.trim()),
    })),
    ingredients_el: product.ingredients_el.map((ingredient: any) => ({
      ...ingredient,
      options: ingredient.options[0].split(',').map((opt: string) => opt.trim()),
    })),
    options_en: product.options_en.map((option: any) => ({
      ...option,
      options: option.options[0].split(',').map((opt: string) => opt.trim()),
    })),
    options_el: product.options_el.map((option: any) => ({
      ...option,
      options: option.options[0].split(',').map((opt: string) => opt.trim()),
    })),
  };
}

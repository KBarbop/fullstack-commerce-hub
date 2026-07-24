import ProductPageClient from "./ProductPageClient";
import { fetchProductBySlug } from "@/util/fetchProductsBySlug";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: { slug: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;

  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} />;
}

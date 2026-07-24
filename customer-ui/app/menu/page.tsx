"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "@/store/category-slice/category-slice";
import { fetchProducts } from "@/store/product-slice/product-slice";
import { AppDispatch, RootState } from "@/store/store";
import MenuWrapper from "@/components/menu/menu-wrapper/MenuWrapper";
import MenuHeading from "@/components/menu/menu-heading/MenuHeading";
import LoadingSpinner from "@/components/ui/loading-spinner/PageLoadingSpinner";

const Index: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state: RootState) => state.category);

  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  if (categoriesLoading || productsLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  if (categoriesError || productsError) {
    return <p>Error: {categoriesError || productsError}</p>;
  }

  return (
    <>
      <MenuHeading />
      <MenuWrapper categories={categories} products={products} />
    </>
  );
};

export default Index;

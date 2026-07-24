"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "@/store/cart-slice/cart-slice";
import Ingredients from "@/components/menu/ingredients/Ingredients";
import Options from "@/components/menu/options/Options";
import { useTranslation } from "next-i18next";
import styles from "./page.module.css";

interface ProductPageClientProps {
  product: any;
}

const ProductPageClient: React.FC<ProductPageClientProps> = ({ product }) => {
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation();
  const currentLocale = i18n.language;

  const [selectedIngredients, setSelectedIngredients] = useState<
    Array<{ option: string; index: number; en: string; el: string }>
  >([]);
  const [selectedOptions, setSelectedOptions] = useState<
    Array<{
      group: string;
      options: Array<{ option: string; index: number; en: string; el: string }>;
    }>
  >([]);
  const [totalPrice, setTotalPrice] = useState<number>(product.price);

  const handleIngredientsChange = (
    ingredients: Array<{
      option: string;
      index: number;
      en: string;
      el: string;
    }>
  ) => {
    setSelectedIngredients(ingredients);
  };

  const handleOptionsChange = (
    options: Array<{
      group: string;
      options: Array<{ option: string; index: number; en: string; el: string }>;
    }>
  ) => {
    setSelectedOptions(options);
  };

  const handleAddToCart = () => {
    if (!product) {
      console.error("Product is undefined");
      return;
    }
    dispatch(
      addProduct({
        product,
        quantity: 1,
        selectedIngredients: selectedIngredients,
        selectedOptions: selectedOptions,
        totalPrice: product.price,
      })
    );
  };

  return (
    <div className={styles.productPage}>
      <div className={styles.productContent}>
        <div className={styles.productImageContainer}>
          <img
            className={styles.productImage}
            src={product.image || "/default-image.jpg"}
            alt={product.title_en}
          />
        </div>
        <div className={styles.productDetails}>
          <h1 className={styles.productTitle}>
            {currentLocale === "el" ? product.title_el : product.title_en}
          </h1>
          <p className={styles.productDesc}>
            {currentLocale === "el"
              ? product.description_el
              : product.description_en}
          </p>
          <p className={styles.productPrice}>
            {t("price")}: €{totalPrice}
          </p>

          <Ingredients
            ingredients_en={product.ingredients_en}
            ingredients_el={product.ingredients_el}
            currentLocale={currentLocale}
            onIngredientsChange={handleIngredientsChange}
          />

          <Options
            options_en={product.options_en}
            options_el={product.options_el}
            currentLocale={currentLocale}
            onOptionsChange={handleOptionsChange}
          />

          <button className={styles.addToCartButton} onClick={handleAddToCart}>
            {t("addToCart")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPageClient;

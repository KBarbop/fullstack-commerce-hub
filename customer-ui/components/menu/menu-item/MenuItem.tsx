"use client";

import Image from "next/image";
import Link from "next/link";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { addProduct } from "@/store/cart-slice/cart-slice";
import { RootState } from "@/store/store";
import { Product } from "@/types";
import { useTranslation } from "next-i18next";

import styles from "./menu-item.module.css";

interface TranslatedProduct extends Product {
  title: string;
  description: string;
}

interface MenuItemProps {
  product: TranslatedProduct;
}

const MenuItem: React.FC<MenuItemProps> = ({ product }) => {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    const totalPrice = product.price || 0;

    dispatch(
      addProduct({
        product,
        selectedIngredients: [],
        selectedOptions: [],
        quantity: 1,
        totalPrice,
      })
    );
  };
  const findCartItem = cart.items.find(
    (item) => item.product._id === product._id
  );

  return (
    <div className={styles.menuItem}>
      <Link href={`/product/${product.slug}`}>
        <div className={styles.imageContainer}>
          <Image
            src={product.image || "/default-image.jpg"}
            alt={product.title || "Product Image"}
            layout="fill"
          />
        </div>
      </Link>
      <div className={styles.content}>
        <h4 className={styles.title}>{product.title || "No Title"}</h4>
        <p className={styles.description}>
          {product.description || "No description available"}
        </p>
        <div className={styles.footer}>
          <span className={styles.price}>€{product.price || "N/A"}</span>
          <button
            className={styles.addToCartButton}
            onClick={handleAddToCart}
            disabled={Boolean(findCartItem)}
          >
            <RiShoppingCart2Fill />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;

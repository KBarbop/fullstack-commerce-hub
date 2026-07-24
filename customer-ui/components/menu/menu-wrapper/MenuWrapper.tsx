"use client";

import { useState, useEffect, useRef } from "react";
import Title from "@/components/ui/title/Title";
import MenuItem from "@/components/menu/menu-item/MenuItem";
import styles from "./menu-wrapper.module.css";
import { Category, Product, TranslatedProduct } from "@/types";
import { useTranslation } from "next-i18next";

interface MenuWrapperProps {
  categories: Category[];
  products: Product[];
}

const MenuWrapper: React.FC<MenuWrapperProps> = ({ categories, products }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;

  const getTranslatedCategoryTitle = (category: Category) => {
    return currentLocale === "el" ? category.title_el : category.title_en;
  };

  const getTranslatedProductTitle = (product: Product) => {
    return currentLocale === "el" ? product.title_el : product.title_en;
  };

  const getTranslatedProductDescription = (product: Product) => {
    return currentLocale === "el"
      ? product.description_el
      : product.description_en;
  };

  useEffect(() => {
    const handleScroll = () => {
      const categoryTopOffsets = categoryRefs.current.map((ref) => {
        return ref ? Math.abs(ref.getBoundingClientRect().top) : Infinity;
      });

      const closestCategoryIndex = categoryTopOffsets.indexOf(
        Math.min(...categoryTopOffsets)
      );

      if (closestCategoryIndex !== -1) {
        setActiveCategory(
          getTranslatedCategoryTitle(categories[closestCategoryIndex])
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [categories, currentLocale]);

  const handleCategoryClick = (index: number) => {
    categoryRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
    });
    setActiveCategory(getTranslatedCategoryTitle(categories[index]));
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <ul className={styles.filterList}>
          {categories.map((category, index) => (
            <li
              key={category._id}
              className={`${styles.filterItem} ${
                activeCategory === getTranslatedCategoryTitle(category)
                  ? styles.activeFilter
                  : ""
              }`}
              onClick={() => handleCategoryClick(index)}
            >
              {getTranslatedCategoryTitle(category)}
            </li>
          ))}
        </ul>
      </aside>
      <main className={styles.mainContent}>
        {categories.map((category, index) => (
          <div
            key={category._id}
            ref={(el) => {
              categoryRefs.current[index] = el;
            }}
            data-category={getTranslatedCategoryTitle(category)}
            className={styles.categorySection}
          >
            <Title addClass={styles.title}>
              {getTranslatedCategoryTitle(category)}
            </Title>
            <div className={`${styles.grid} ${styles.gridColumns}`}>
              {products
                .filter((product) => product.category === category._id)
                .map((product) => {
                  const translatedProduct: TranslatedProduct = {
                    ...product,
                    title: getTranslatedProductTitle(product),
                    description: getTranslatedProductDescription(product),
                  };
                  return (
                    <MenuItem
                      key={product._id}
                      product={{
                        ...product,
                        title: getTranslatedProductTitle(product),
                        description: getTranslatedProductDescription(product),
                      }}
                    />
                  );
                })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default MenuWrapper;

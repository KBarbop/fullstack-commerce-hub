"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { RootState } from "@/store/store";
import {
  decreaseQuantity,
  increaseQuantity,
} from "@/store/cart-slice/cart-slice";

import { AnimatePresence, motion } from "framer-motion";
import Title from "@/components/ui/title/Title";
import CheckoutModal from "@/components/ui/modal/CheckoutModal";
import AuthRedirectModal from "@/components/ui/modal/AuthRedirectModal";

import { CartItem } from "@/types";

import styles from "./page.module.css";

interface CartProps {}

const Cart: React.FC<CartProps> = ({}) => {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language;
  const cart = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.auth.user);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isRedirectModalOpen, setRedirectModalOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const toggleRow = (index: number) => {
    if (activeRow === index) {
      setActiveRow(null);
    } else {
      setActiveRow(index);
    }
  };

  const getTranslatedTitle = (item: CartItem) => {
    return currentLocale === "el"
      ? item.product.title_el
      : item.product.title_en;
  };

  const getTranslatedIngredients = (item: CartItem) => {
    return item.selectedIngredients!.map((ingredient) => {
      return currentLocale === "el" ? ingredient.el : ingredient.en;
    });
  };

  const getTranslatedOptions = (item: CartItem) => {
    return item.selectedOptions!.map((optionGroup) =>
      optionGroup.options.map((opt) =>
        currentLocale === "el" ? opt.el : opt.en
      )
    );
  };

  const handleCheckout = () => {
    if (!user) {
      setRedirectModalOpen(true);
    } else {
      setModalOpen(true);
    }
  };

  const handleRedirect = () => {
    setRedirectModalOpen(false);
    router.push("/auth/login");
  };

  const quantityChange = (type: number, item: CartItem) => {
    if (type === 0) {
      dispatch(
        decreaseQuantity({
          _id: item.product._id,
          price: item.product.price,
        })
      );
    }
    if (type === 1) {
      dispatch(
        increaseQuantity({
          _id: item.product._id,
          price: item.product.price,
        })
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.flexContainer}>
        <div className={styles.tableContainer}>
          {cart.items.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead className={styles.tableHead}>
                  <tr>
                    <th scope="col" className={styles.th}>
                      {t("product")}
                    </th>
                    <th scope="col" className={styles.thResp}>
                      {t("ingredients")}
                    </th>
                    <th scope="col" className={styles.thResp}>
                      {t("options")}
                    </th>
                    <th scope="col" className={styles.th}>
                      {t("price")}
                    </th>
                    <th scope="col" className={styles.th}>
                      {t("quantity")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item, index) => (
                    <>
                      <tr className={styles.tableRow} key={item.product._id}>
                        <td className={styles.td}>
                          {getTranslatedTitle(item)}
                        </td>
                        <td className={styles.tdResp}>
                          {item.selectedIngredients &&
                          item.selectedIngredients.length > 0
                            ? getTranslatedIngredients(item).map(
                                (translatedIngredient, idx) => (
                                  <span key={idx}>
                                    {translatedIngredient} <br />
                                  </span>
                                )
                              )
                            : t("noIngredientsSelected")}
                        </td>
                        <td className={styles.tdResp}>
                          {item.selectedOptions &&
                          item.selectedOptions.length > 0
                            ? getTranslatedOptions(item).map(
                                (translatedOptionGroup, idx) => (
                                  <span key={idx}>
                                    {translatedOptionGroup.join(", ")}
                                  </span>
                                )
                              )
                            : t("noOptionsSelected")}
                        </td>
                        <td className={styles.td}>€{item.product.price}</td>
                        <td className={styles.td}>
                          <div className={styles.quantityContainer}>
                            <button
                              className={styles.quantityButton}
                              onClick={() => quantityChange(0, item)}
                            >
                              <i
                                className={`fa-solid fa-chevron-left ${styles.chevron}`}
                              ></i>
                            </button>
                            {item.quantity}
                            <button
                              className={styles.quantityButton}
                              onClick={() => quantityChange(1, item)}
                            >
                              <i
                                className={`fa-solid fa-chevron-right ${styles.chevron}`}
                              ></i>
                            </button>

                            <motion.div
                              className={styles.dropdownButton}
                              animate={{
                                rotate: activeRow === index ? 180 : 0,
                              }}
                              transition={{ duration: 0.3 }}
                              onClick={() => toggleRow(index)}
                            >
                              &#9660;
                            </motion.div>
                          </div>
                        </td>
                      </tr>

                      {activeRow === index && (
                        <tr className={styles.tableRow}>
                          <td colSpan={5}>
                            <div className={styles.dropdownContent}>
                              <p>
                                <strong>{t("ingredients")}:</strong>{" "}
                                {item.selectedIngredients &&
                                item.selectedIngredients.length > 0
                                  ? getTranslatedIngredients(item).map(
                                      (translatedIngredient, i) => (
                                        <span key={i}>
                                          {translatedIngredient} <br />
                                        </span>
                                      )
                                    )
                                  : t("noIngredientsSelected")}
                              </p>
                              <p>
                                <strong>{t("options")}:</strong>{" "}
                                {item.selectedOptions &&
                                item.selectedOptions.length > 0
                                  ? getTranslatedOptions(item).map(
                                      (translatedOptionGroup, i) => (
                                        <span key={i}>
                                          {translatedOptionGroup.join(", ")}
                                        </span>
                                      )
                                    )
                                  : t("noOptionsSelected")}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.emptyCart}>
              <h1 className={styles.emptyCartText}>{t("emptyCartText")}</h1>
              <button
                className={styles.btnPrimary}
                onClick={() => router.push("/menu")}
              >
                {t("goToMenu")}
              </button>
            </div>
          )}
        </div>
        <div className={styles.cartTotalContainer}>
          <Title addClass={styles.cartTotalTitle}>{t("cartTotal")}</Title>

          <div className={styles.cartTotal}>
            <b>{t("total")}: </b>€{cart.totalAmount}
          </div>

          <div>
            <button
              className={`${styles.btnPrimary} ${
                cart.totalAmount <= 0 ? styles.btnDisabled : ""
              }`}
              onClick={handleCheckout}
              disabled={cart.totalAmount <= 0}
            >
              <span key={cart.totalAmount <= 0 ? "empty" : "checkout"}>
                {cart.totalAmount <= 0 ? t("addItemsToCart") : t("checkoutNow")}
              </span>
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <CheckoutModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
        />
      </AnimatePresence>
      <AuthRedirectModal
        isOpen={isRedirectModalOpen}
        onClose={handleRedirect}
      />
    </div>
  );
};

export default Cart;

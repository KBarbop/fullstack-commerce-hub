"use client";

import React, { useEffect } from "react";
import classes from "./orders-history.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "@/store/orders-slice/orders-slice";
import { AppDispatch, RootState } from "@/store/store";
import ComponentLoadingSpinner from "@/components/ui/loading-spinner/ComponentLoadingSpinner";
import { useTranslation } from "react-i18next";

const OrdersHistory: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { orderList, loading, error } = useSelector(
    (state: RootState) => state.order
  );

  // const { productDetails } = useSelector((state: RootState) => state.product);
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <div className={classes.spinnerContainer}>
        <ComponentLoadingSpinner />
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>{t("historyOfOrders")}</h2>
      <table className={classes.orderTable}>
        <thead>
          <tr>
            <th>{t("dateTime")}</th>
            <th>{t("address")}</th>
            <th>{t("orderedProducts")}</th>
            <th>{t("status")}</th>
          </tr>
        </thead>
        <tbody>
          {orderList.map((order, index) => (
            <tr key={index}>
              <td>{new Date(order.timeReceived).toLocaleString()}</td>
              <td>
                {order.address.street} {order.address.streetNumber},{" "}
                {order.address.city}
              </td>
              <td>
                {order.products
                  .map((product) => product.productName)
                  .join(", ")}{" "}
              </td>
              <td
                className={classes[order.status.toLowerCase().replace(" ", "")]}
              >
                {order.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersHistory;

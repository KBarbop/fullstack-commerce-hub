"use client";

import React, { useState, useEffect, Key } from "react";
import { PaymentForm } from "@/components/payment/PaymentForm";
import { FaCreditCard, FaHome, FaMoneyBill } from "react-icons/fa";
import styles from "./checkout-modal.module.css";
import { StripeProvider } from "@/components/payment/StripeProvider";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { createOrder } from "@/store/orders-slice/orders-slice";
import { resetCart } from "@/store/cart-slice/cart-slice";
import { Address } from "@/types";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [addressData, setAddressData] = useState<Address>({
    address: {
      street: "",
      streetNumber: "",
      zipCode: "",
      city: "Placeholder City",
      fullAddress: "",
      bellName: "",
    },
  });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [doorbellName, setDoorbellName] = useState("");
  const [floor, setFloor] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPaymentStep, setIsPaymentStep] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showDropdown, setShowDropdown] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const savedAddresses = user?.addresses || [];
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  );

  useEffect(() => {
    if (isOpen) {
      if (!window.google) {
        loadGoogleMapsScript(() => initializeMap());
      } else {
        initializeMap();
      }
    }
  }, [isOpen]);

  const loadGoogleMapsScript = (callback: () => void) => {
    const existingScript = document.getElementById("googleMaps");
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
      script.id = "googleMaps";
      document.body.appendChild(script);

      script.onload = () => {
        if (callback) callback();
      };
    } else if (callback) callback();
  };

  const initializeMap = () => {
    const mapElement = document.getElementById("map");
    const inputElement = document.getElementById(
      "address-input",
    ) as HTMLInputElement;

    if (!mapElement || !inputElement) {
      console.error("Map or input element not found");
      return;
    }

    if (!window.google) {
      console.error("Google Maps script not loaded");
      return;
    }

    // delivery zone bounds and center
    const nafpaktosBounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(51.47, -0.15),
      new window.google.maps.LatLng(51.54, -0.02),
    );

    const map = new window.google.maps.Map(mapElement, {
      center: { lat: 51.505, lng: -0.09 },
      zoom: 13,
      restriction: {
        latLngBounds: nafpaktosBounds,
        strictBounds: true,
      },
    });

    const marker = new window.google.maps.Marker({
      map,
      draggable: true,
    });

    const geocoder = new window.google.maps.Geocoder();

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputElement,
      {
        bounds: nafpaktosBounds,
        strictBounds: true,
      },
    );

    autocomplete.bindTo("bounds", map);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        setError(t("errorSelectValidLocation"));
        return;
      }

      if (!nafpaktosBounds.contains(place.geometry.location!)) {
        setError(t("errorSelectWithinNafpaktos"));
        return;
      }

      setError(null);
      setAddressData({
        address: {
          ...addressData.address,
          fullAddress: place.formatted_address || "",
          street:
            place.address_components?.find((comp) =>
              comp.types.includes("route"),
            )?.long_name || " ",
          streetNumber:
            place.address_components?.find((comp) =>
              comp.types.includes("street_number"),
            )?.long_name || "",
          zipCode:
            place.address_components?.find((comp) =>
              comp.types.includes("postal_code"),
            )?.long_name || "",
          city:
            place.address_components?.find((comp) =>
              comp.types.includes("locality"),
            )?.long_name || "Nafpaktos",
        },
      });

      map.setCenter(place.geometry.location!);
      map.setZoom(17);
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
    });

    map.addListener("click", (event: google.maps.MapMouseEvent) => {
      const latLng = event.latLng;
      if (!latLng) return;

      if (!nafpaktosBounds.contains(latLng)) {
        setError(t("errorSelectWithinNafpaktos"));
        return;
      }

      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          setError(null);
          setAddressData({
            address: {
              ...addressData.address,
              fullAddress: results[0].formatted_address || "",
              street:
                results[0].address_components?.find((comp) =>
                  comp.types.includes("route"),
                )?.long_name || results[0].formatted_address,
              streetNumber:
                results[0].address_components?.find((comp) =>
                  comp.types.includes("street_number"),
                )?.long_name || "",
              zipCode:
                results[0].address_components?.find((comp) =>
                  comp.types.includes("postal_code"),
                )?.long_name || "",
              city:
                results[0].address_components?.find((comp) =>
                  comp.types.includes("locality"),
                )?.long_name || "Nafpaktos",
            },
          });
          inputElement.value = results[0].formatted_address;
          marker.setPosition(latLng);
          marker.setVisible(true);
        } else {
          console.log("Geocoder failed: " + status);
        }
      });
    });

    marker.addListener("dragend", () => {
      const position = marker.getPosition();
      if (!position) return;

      if (!nafpaktosBounds.contains(position)) {
        setError(t("errorSelectWithinNafpaktos"));
        return;
      }

      geocoder.geocode({ location: position }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          setError(null);
          setAddressData({
            address: {
              ...addressData.address,
              fullAddress: results[0].formatted_address || "",
              street:
                results[0].address_components?.find((comp) =>
                  comp.types.includes("route"),
                )?.long_name || results[0].formatted_address,
              streetNumber:
                results[0].address_components?.find((comp) =>
                  comp.types.includes("street_number"),
                )?.long_name || "",
              zipCode:
                results[0].address_components?.find((comp) =>
                  comp.types.includes("postal_code"),
                )?.long_name || "",
              city:
                results[0].address_components?.find((comp) =>
                  comp.types.includes("locality"),
                )?.long_name || "Nafpaktos",
            },
          });
          inputElement.value = results[0].formatted_address;
        } else {
          console.log("Geocoder failed: " + status);
        }
      });
    });
  };

  const handleBack = () => {
    setIsPaymentStep(false);
  };

  const handleAddressSubmit = () => {
    if (!addressData.address.fullAddress || !doorbellName) {
      setError(t("errorFillAddressFields"));
      return;
    }
    setError(null);
    setIsPaymentStep(true);
  };

  const handleModalClose = () => {
    setIsPaymentStep(false);
    setIsLoading(false);
    setIsSuccess(false);
    onClose();
  };

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPaymentMethod(e.target.value as "card" | "cash");
  };

  const handleOrderPlacement = async () => {
    if (!addressData.address.fullAddress || !doorbellName) {
      setError(t("errorFillAddressFields"));
      return;
    }

    setIsLoading(true);
    setError(null);

    const orderData = {
      products: cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        ingredients: item.selectedIngredients
          ? item.selectedIngredients.map((ingredient) => ingredient.el)
          : [],
        options: item.selectedOptions
          ? item.selectedOptions.flatMap((optionGroup) =>
              optionGroup.options.map((option) => option.el),
            )
          : [],
        price: item.product.price * item.quantity,
        comment: "",
      })),
      address: {
        street: addressData.address.street,
        streetNumber: addressData.address.streetNumber,
        zipCode: addressData.address.zipCode,
        city: addressData.address.city,
        bellName: doorbellName,
        comment: description || "",
      },
      totalPrice: totalAmount,
      paymentWay: paymentMethod,
    };

    try {
      if (paymentMethod === "card") {
        const response = await dispatch(createOrder(orderData)).unwrap();
        setClientSecret(response.data.clientSecret);
        setIsPaymentStep(true);
      } else {
        await dispatch(createOrder(orderData)).unwrap();
        setIsSuccess(true);
        setIsLoading(false);
        dispatch(resetCart());
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
        }, 3000);
      }
    } catch (error) {
      setIsLoading(false);
      setError(t("errorOrderFailed"));
    }
  };

  const onPaymentSuccess = () => {
    setIsPaymentStep(true);
    dispatch(resetCart());
    setIsLoading(false);
    setIsSuccess(true);

    // setTimeout(() => {
    //   onClose();
    //   setIsSuccess(false);
    // }, 3000);
  };

  const handleAddressSelect = (savedAddress: {
    fullAddress: string;
    street?: string;
    streetNumber?: string;
    zipCode?: string;
    city?: string;
    bellName?: string;
  }) => {
    setAddressData({
      address: {
        fullAddress: savedAddress.fullAddress || "",
        street: savedAddress.street || "",
        streetNumber: savedAddress.streetNumber || "",
        zipCode: savedAddress.zipCode || "",
        city: savedAddress.city || "Nafpaktos",
        bellName: savedAddress.bellName || "",
      },
    });

    setDoorbellName(savedAddress.bellName || "");
    setFloor(" ");
    setShowDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressData({
      address: {
        ...addressData.address,
        fullAddress: e.target.value,
      },
    });
    setShowDropdown(true);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className={styles.modalOverlay}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={handleModalClose}>
          &times;
        </button>
        {!isPaymentStep ? (
          <>
            <h2 className={styles.modalTitle}>{t("enterDeliveryDetails")}</h2>
            <div className={styles.inputGroup}>
              <label htmlFor="address-input">{t("address")}:</label>
              <input
                id="address-input"
                type="text"
                value={addressData.address.fullAddress}
                onChange={handleInputChange}
                placeholder={t("searchYourAddress")}
                onFocus={() => setShowDropdown(true)}
              />
              {showDropdown && savedAddresses.length > 0 && (
                <div className={styles.dropdown}>
                  {savedAddresses
                    .filter((savedAddress: { fullAddress: string }) =>
                      savedAddress.fullAddress
                        ? savedAddress.fullAddress
                            .toLowerCase()
                            .includes(
                              addressData.address.fullAddress.toLowerCase(),
                            )
                        : false,
                    )
                    .map(
                      (
                        savedAddress: { fullAddress: string },
                        index: Key | null | undefined,
                      ) => (
                        <div
                          key={index}
                          className={styles.dropdownItem}
                          onClick={() => handleAddressSelect(savedAddress)}
                        >
                          <FaHome className={styles.dropdownIcon} />
                          {savedAddress.fullAddress}
                        </div>
                      ),
                    )}
                </div>
              )}
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <div id="map" className={styles.map}></div>

            <div className={styles.inputGroup}>
              <label htmlFor="doorbell">{t("doorbellName")}:</label>
              <input
                id="doorbell"
                type="text"
                value={doorbellName}
                onChange={(e) => setDoorbellName(e.target.value)}
                placeholder={t("exampleDoorbellName")}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="floor">{t("floor")}:</label>
              <input
                id="floor"
                type="text"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder={t("floor")}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="description">
                {t("additionalInstructions")}:
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("exampleAdditionalInstructions")}
              ></textarea>
            </div>

            <div className={styles.paymentGroup}>
              <label>{t("paymentMethod")}:</label>
              <div className={styles.paymentOptions}>
                <div className={styles.paymentOption}>
                  <input
                    type="radio"
                    id="card-payment"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={handlePaymentMethodChange}
                  />
                  <label htmlFor="card-payment">
                    <div className={styles.paymentIcon}>
                      <FaCreditCard />
                    </div>
                    {t("card")}
                  </label>
                </div>
                <div className={styles.paymentOption}>
                  <input
                    type="radio"
                    id="cash-payment"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={handlePaymentMethodChange}
                  />
                  <label htmlFor="cash-payment">
                    <div className={styles.paymentIcon}>
                      <FaMoneyBill />
                    </div>
                    {t("cash")}
                  </label>
                </div>
              </div>
            </div>

            <button
              className={styles.btnPrimary}
              onClick={
                paymentMethod == "card"
                  ? handleOrderPlacement
                  : handleAddressSubmit
              }
            >
              {t("confirmAddress")}
            </button>
          </>
        ) : (
          <>
            <h2 className={styles.modalTitle}>{t("paymentDetails")}</h2>
            {paymentMethod === "card" && clientSecret ? (
              <>
                <button className={styles.btnSecondary} onClick={handleBack}>
                  {t("back")}
                </button>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm
                    clientSecret={clientSecret}
                    onSuccess={onPaymentSuccess}
                  />
                </Elements>
              </>
            ) : (
              <div>
                {isLoading ? (
                  <div className={styles.loadingSpinner}></div>
                ) : isSuccess ? (
                  <div className={styles.successMessage}>
                    <span className={styles.successCheckmark}>✔</span>
                    <p>{t("orderPlacedSuccessfully")}</p>
                  </div>
                ) : (
                  <div>
                    <p>{t("cashPaymentConfirmation")}</p>
                    <div className={styles.checkoutButtonsRow}>
                      <button
                        className={styles.btnSecondary}
                        onClick={handleBack}
                      >
                        {t("back")}
                      </button>
                      <button
                        className={styles.btnPrimary}
                        onClick={handleOrderPlacement}
                      >
                        {t("placeOrder")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default CheckoutModal;

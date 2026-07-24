"use client";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  addAddress,
  removeAddress,
} from "@/store/addreses-slice/addresses-slice";
import { useState, useEffect } from "react";
import classes from "./addresses-info.module.css";
import { FaMapMarkerAlt, FaTrash, FaSave } from "react-icons/fa";
import MapModal from "@/components/ui/modal/MapModal";
import { Address, FetchedAddress } from "@/types";
import * as yup from "yup";
import React from "react";
import { useTranslation } from "react-i18next";

const addressSchema = yup.object().shape({
  fullAddress: yup.string().required("Full address is required"),
  bellName: yup.string().required("Doorbell Name is required"),
});

const FavoriteAddressesForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const addressesFromAuth = user ? user.addresses : [];

  const [addressesData, setAddressesData] = useState<
    (Address & { isSaved: boolean; errors: { [key: string]: string } })[]
  >([]);

  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [currentAddressIndex, setCurrentAddressIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (Array.isArray(addressesFromAuth) && addressesFromAuth.length > 0) {
      const mappedAddresses = addressesFromAuth.map((addr: FetchedAddress) => ({
        address: {
          fullAddress: addr.fullAddress || " ",
          street: addr.street || " ",
          streetNumber: addr.streetNumber || " ",
          zipCode: addr.zipCode || " ",
          city: addr.city || " ",
          bellName: addr.bellName || " ",
        },
        isSaved: true,
        errors: {},
      }));
      setAddressesData(mappedAddresses);
    }
  }, [addressesFromAuth]);

  useEffect(() => {
    const loadGoogleMapsScript = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        const existingScript = document.getElementById("googleMaps");
        const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (!existingScript) {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&language=en`;
          script.id = "googleMaps";
          document.body.appendChild(script);

          script.onload = () => {
            resolve();
          };

          script.onerror = () => {
            reject("Google Maps failed to load");
          };
        } else {
          resolve();
        }
      });
    };
    loadGoogleMapsScript();
  }, []);

  const initializeAutocomplete = (index: number) => {
    const inputElement = document.getElementById(
      `autocomplete-address-input-${index}`,
    ) as HTMLInputElement;

    // delivery zone bounds
    const nafpaktosBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(51.47, -0.15),
      new google.maps.LatLng(51.54, -0.02),
    );

    if (inputElement && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputElement,
        {
          bounds: nafpaktosBounds,
          strictBounds: true,
          fields: ["address_components", "formatted_address", "geometry"],
        },
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        if (place.geometry) {
          const addressComponents = place.address_components || [];

          const streetNumber =
            addressComponents.find((comp) =>
              comp.types.includes("street_number"),
            )?.long_name || "";
          const street =
            addressComponents.find((comp) => comp.types.includes("route"))
              ?.long_name || "";
          const zipCode =
            addressComponents
              .find((comp) => comp.types.includes("postal_code"))
              ?.long_name.replace(/\s+/g, "") || "";
          const city =
            addressComponents.find((comp) => comp.types.includes("locality"))
              ?.long_name || "";

          setAddressesData((prevAddresses) => {
            const updatedAddresses = [...prevAddresses];
            updatedAddresses[index].address.fullAddress =
              place.formatted_address || " ";
            updatedAddresses[index].address.streetNumber = streetNumber || " ";
            updatedAddresses[index].address.street = street || " ";
            updatedAddresses[index].address.zipCode = zipCode || "12345";
            updatedAddresses[index].address.city = city || " ";
            updatedAddresses[index].isSaved = false;
            updatedAddresses[index].errors = {};
            return updatedAddresses;
          });
        }
      });
    }
  };

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setAddressesData((prevAddresses) =>
      prevAddresses.map((address, i) =>
        i === index
          ? {
              ...address,
              address: { ...address.address, [name]: value },
              isSaved: false,
              errors: {},
            }
          : address,
      ),
    );
  };

  const handleAddAddress = () => {
    setAddressesData([
      ...addressesData,
      {
        address: {
          fullAddress: "",
          street: "",
          streetNumber: "",
          zipCode: "",
          city: "Placeholder City",
          bellName: "",
        },
        isSaved: false,
        errors: {},
      },
    ]);
  };

  const handleMapIconClick = (index: number) => {
    setCurrentAddressIndex(index);
    setIsMapModalOpen(true);
  };

  const handleModalClose = () => {
    setIsMapModalOpen(false);
  };

  const validateAddress = async (index: number) => {
    try {
      const { isSaved, errors, ...addressToValidate } = addressesData[index];
      await addressSchema.validate(addressToValidate.address, {
        abortEarly: false,
      });
      return {};
    } catch (err: any) {
      const errors: { [key: string]: string } = {};
      if (err.inner) {
        err.inner.forEach((error: any) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
      }
      return errors;
    }
  };

  const handleSaveIconClick = async (index: number) => {
    const errors = await validateAddress(index);
    if (Object.keys(errors).length > 0) {
      setAddressesData((prevAddresses) =>
        prevAddresses.map((address, i) =>
          i === index ? { ...address, errors } : address,
        ),
      );
      return;
    }

    try {
      setLoadingIndex(index);
      const { isSaved, ...addressToSave } = addressesData[index].address;
      await dispatch(addAddress({ address: addressToSave })).unwrap();
      setAddressesData((prevAddresses) =>
        prevAddresses.map((address, i) =>
          i === index ? { ...address, isSaved: true } : address,
        ),
      );
    } catch (error) {
      console.error("Failed to save address:", error);
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleDeleteIconClick = async (index: number) => {
    const addressToDelete = addressesData[index];
    try {
      await dispatch(
        removeAddress(addressToDelete.address.fullAddress),
      ).unwrap();

      setAddressesData((prevAddresses) =>
        prevAddresses.filter((_, i) => i !== index),
      );
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  return (
    <>
      <form className={classes.form}>
        <h2> {t("favoriteAddresses")}</h2>
        {addressesData.map((address, index) => (
          <div className={classes.addressItem} key={index}>
            <div className={classes.inputGroup}>
              <div className={classes.primaryInput}>
                <label className={classes.label}>
                  {t("address")}:
                  <input
                    id={`autocomplete-address-input-${index}`}
                    className={classes.input}
                    type="text"
                    name="fullAddress"
                    value={address.address.fullAddress || ""}
                    onChange={(e) => handleChange(index, e)}
                    onFocus={() => initializeAutocomplete(index)}
                  />
                  {address.errors.fullAddress && (
                    <span className={classes.error}>
                      {address.errors.fullAddress}
                    </span>
                  )}
                </label>
                {!address.isSaved && (
                  <FaMapMarkerAlt
                    className={classes.mapIcon}
                    onClick={() => handleMapIconClick(index)}
                  />
                )}
              </div>
              <div className={classes.secondaryInputs}>
                <label className={classes.label}>
                  {t("doorbell")}:
                  <input
                    className={classes.input}
                    type="text"
                    name="bellName"
                    value={address.address.bellName || ""}
                    onChange={(e) => handleChange(index, e)}
                  />
                  {address.errors.bellName && (
                    <span className={classes.error}>
                      {address.errors.bellName}
                    </span>
                  )}
                </label>

                <label className={classes.label}>
                  {t("floor")}:
                  <input
                    className={classes.input}
                    type="text"
                    name="floor"
                    // value={address.address.floor || ""}
                    // onChange={(e) => handleChange(index, e)}
                  />
                </label>
              </div>
            </div>

            {address.isSaved ? (
              <FaTrash
                className={classes.deleteIcon}
                onClick={() => handleDeleteIconClick(index)}
              />
            ) : (
              <button
                className={classes.saveButton}
                type="button"
                onClick={() => handleSaveIconClick(index)}
                disabled={loadingIndex === index}
              >
                {loadingIndex === index ? (
                  <div className={classes.spinner}></div>
                ) : (
                  <>
                    <FaSave /> {t("save")}
                  </>
                )}
              </button>
            )}
          </div>
        ))}

        <button
          className={classes.addButton}
          type="button"
          onClick={handleAddAddress}
        >
          {t("addAddress")}
        </button>
      </form>

      {isMapModalOpen && (
        <MapModal
          isOpen={isMapModalOpen}
          onClose={handleModalClose}
          setAddress={(
            fullAddress: string,
            street: string,
            streetNumber: string,
            zipCode: string,
          ) => {
            if (currentAddressIndex !== null) {
              setAddressesData((prevAddresses) => {
                const updatedAddresses = [...prevAddresses];
                updatedAddresses[currentAddressIndex].address.fullAddress =
                  fullAddress;
                updatedAddresses[currentAddressIndex].address.street = street;
                updatedAddresses[currentAddressIndex].address.streetNumber =
                  streetNumber;
                updatedAddresses[currentAddressIndex].address.zipCode = zipCode;
                updatedAddresses[currentAddressIndex].isSaved = false;
                updatedAddresses[currentAddressIndex].errors = {};
                return updatedAddresses;
              });
            }
          }}
          currentAddress={
            currentAddressIndex !== null
              ? addressesData[currentAddressIndex].address.fullAddress
              : " "
          }
        />
      )}
    </>
  );
};

export default FavoriteAddressesForm;

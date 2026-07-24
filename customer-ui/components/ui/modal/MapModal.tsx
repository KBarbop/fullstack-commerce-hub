"use client";

import { useEffect, useState } from "react";
import classes from "./map-modal.module.css";
import { useTranslation } from "react-i18next";

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  setAddress: (
    fullAddress: string,
    street: string,
    streetNumber: string,
    zipCode: string,
  ) => void;
  currentAddress: string;
}

const MapModal: React.FC<MapModalProps> = ({
  isOpen,
  onClose,
  setAddress,
  currentAddress,
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [streetNumber, setStreetNumber] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen && window.google) {
      initializeMap();
    }
  }, [isOpen]);

  const initializeMap = () => {
    const mapElement = document.getElementById("map") as HTMLElement;
    const geocoder = new google.maps.Geocoder();

    if (!mapElement) return;

    // delivery zone bounds and center
    const nafpaktosBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(51.47, -0.15),
      new google.maps.LatLng(51.54, -0.02),
    );

    const defaultLocation = new google.maps.LatLng(51.505, -0.09);
    const mapInstance = new google.maps.Map(mapElement, {
      center: defaultLocation,
      zoom: 13,
      restriction: {
        latLngBounds: nafpaktosBounds,
        strictBounds: true,
      },
    });

    const markerInstance = new google.maps.Marker({
      map: mapInstance,
      draggable: true,
      position: defaultLocation,
    });

    if (currentAddress) {
      geocodeAddress(geocoder, currentAddress, mapInstance, markerInstance);
    }

    mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
      const latLng = event.latLng;
      if (latLng) {
        geocodeLatLng(geocoder, latLng, markerInstance);
      }
    });

    markerInstance.addListener("dragend", () => {
      const position = markerInstance.getPosition();
      if (position) {
        geocodeLatLng(geocoder, position, markerInstance);
      }
    });

    setMap(mapInstance);
    setMarker(markerInstance);
  };

  const geocodeLatLng = (
    geocoder: google.maps.Geocoder,
    latLng: google.maps.LatLng,
    markerInstance: google.maps.Marker,
  ) => {
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        setError(null);
        const address = results[0].formatted_address;
        extractAddressComponents(results[0].address_components);
        setSelectedAddress(address);
        markerInstance.setPosition(latLng);
      } else {
        setError("Geocoder failed: " + status);
      }
    });
  };

  const geocodeAddress = (
    geocoder: google.maps.Geocoder,
    address: string,
    mapInstance: google.maps.Map,
    markerInstance: google.maps.Marker,
  ) => {
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK" && results && results[0].geometry) {
        mapInstance.setCenter(results[0].geometry.location);
        markerInstance.setPosition(results[0].geometry.location);
        mapInstance.setZoom(17);
        extractAddressComponents(results[0].address_components);
        setSelectedAddress(results[0].formatted_address);
      } else {
        setError(
          "Geocode was not successful for the following reason: " + status,
        );
      }
    });
  };

  const extractAddressComponents = (
    addressComponents: google.maps.GeocoderAddressComponent[],
  ) => {
    const streetNumberComp = addressComponents.find((comp) =>
      comp.types.includes("street_number"),
    );
    const streetComp = addressComponents.find((comp) =>
      comp.types.includes("route"),
    );
    const zipCodeComp =
      addressComponents
        .find((comp) => comp.types.includes("postal_code"))
        ?.long_name.replace(/\s+/g, "") || "";

    setStreetNumber(streetNumberComp ? streetNumberComp.long_name : "");
    setStreet(streetComp ? streetComp.long_name : "");
    setZipCode(zipCodeComp);
  };

  const handleSave = () => {
    // Call setAddress with all the details
    setAddress(selectedAddress, street, streetNumber, zipCode);
    onClose();
  };

  return (
    isOpen && (
      <div className={classes.overlay} onClick={onClose}>
        <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
          <button className={classes.closeButton} onClick={onClose}>
            &times;
          </button>
          <h2>
            {t("selectAnAddress")}: {selectedAddress}
          </h2>
          <div id="map" className={classes.map}></div>
          {error && <p className={classes.error}>{error}</p>}
          <button className={classes.saveButton} onClick={handleSave}>
            {t("saveAddress")}
          </button>
        </div>
      </div>
    )
  );
};

export default MapModal;

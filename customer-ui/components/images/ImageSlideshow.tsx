"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import classes from "./image-slideshow.module.css";

interface ImageData {
  image: string;
  alt: string;
}

// image filenames are pulled from the configured s3 bucket
const images: ImageData[] = [
  {
    image: `${process.env.NEXT_PUBLIC_S3_URL}/shop_interior.jpg`,
    alt: "Interior view of the shop",
  },
  {
    image: `${process.env.NEXT_PUBLIC_S3_URL}/shop_exterior.png`,
    alt: "Exterior view of the shop",
  },
];

const ImageSlideshow: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < images.length - 1 ? prevIndex + 1 : 0,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={classes.slideshow}>
      {images.map((image, index) => (
        <img
          key={index}
          src={image.image}
          className={index === currentImageIndex ? classes.active : ""}
          alt={image.alt}
          width={1200}
          height={1000}
        />
      ))}
    </div>
  );
};

export default ImageSlideshow;

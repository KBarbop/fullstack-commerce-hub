"use client";

import Image from "next/image";
import { MdShoppingCart } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Title from "@/components/ui/title/Title";

import styles from "./campaign-item.module.css";

interface CampaignItemProps {
  title: string;
  text: string;
  imageUrl: string;
}

const CampaignItem: React.FC<CampaignItemProps> = ({
  title,
  text,
  imageUrl,
}) => {
  const { t } = useTranslation();
  return (
    <div className={styles.campaignItem}>
      <div className={styles.campaignImageWrapper}>
        <Image
          src={imageUrl}
          alt="Campaign Image"
          layout="fill"
          className={styles.campaignImage}
          objectFit="cover"
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className={styles.campaignText}>
        <Title addClass={styles.campaignTitle}>{title}</Title>
        <div className={styles.discountText}>
          <span className={styles.discountAmount}>{text}</span>
        </div>
        {/* <button className={styles.orderButton}>
          {t("seeProduct")} <MdShoppingCart size={20} />
        </button> */}
      </div>
    </div>
  );
};

export default CampaignItem;

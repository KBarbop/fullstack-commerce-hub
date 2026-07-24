"use client";
import CampaignItem from "@/components/ui/campaign/campaign-item/CampaignItem";
import Header from "@/components/ui/heading/Heading";
import styles from "./campaigns.module.css";
import { useTranslation } from "react-i18next";

const Campaigns: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.campaignsSection}>
      <Header title={t("campaignTitle")} description={t("campaignParagraph")} />
      <div className={styles.campaignsContainer}>
        <CampaignItem title="Featured Item" text="Placeholder" imageUrl="/placeholder-product.svg" />
        <CampaignItem title="Featured Item" text="Placeholder" imageUrl="/placeholder-product.svg" />
        <CampaignItem title="Featured Item" text="Placeholder" imageUrl="/placeholder-product.svg" />
        <CampaignItem title="Featured Item" text="Placeholder" imageUrl="/placeholder-product.svg" />
      </div>
    </div>
  );
};

export default Campaigns;

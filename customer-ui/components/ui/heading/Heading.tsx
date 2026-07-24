import Image from "next/image";
import styles from "./heading.module.css";
import headingLogo from "@/assets/landing-separator-1.png";

interface HeadingProps {
  title: string;
  description: string;
}

const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div className={styles.headingContainer}>
      <h2 className={styles.headingTitle}>{title}</h2>
      <p className={styles.headingDescription}>{description}</p>
      <div className={styles.headingDecoration}>
        <Image
          src={headingLogo}
          alt="Section divider"
          className={styles.separatorIcon}
          layout="intrinsic"
        />
      </div>
    </div>
  );
};

export default Heading;

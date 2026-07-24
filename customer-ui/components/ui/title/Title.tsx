import { ReactNode } from "react";
import styles from "./title.module.css";

interface TitleProps {
  children: ReactNode;
  addClass?: string;
}

const Title: React.FC<TitleProps> = ({ children, addClass = "" }) => {
  return <div className={`${styles.title} ${addClass}`}>{children}</div>;
};

export default Title;

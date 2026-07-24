import React from "react";
import { motion } from "framer-motion";
import styles from "./auth-redirect-modal.module.css";

interface AuthRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthRedirectModal: React.FC<AuthRedirectModalProps> = ({
  isOpen,
  onClose,
}) => {
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
        <h2>Login Required</h2>
        <p>You need to log in to proceed with the checkout.</p>
        <button className={styles.okButton} onClick={onClose}>
          OK
        </button>
      </div>
    </motion.div>
  );
};

export default AuthRedirectModal;

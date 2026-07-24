import styles from './homepage.module.css';
import {AppstoreAddOutlined} from "@ant-design/icons";
import {Button} from "antd";
import {useNavigate} from "react-router";

const Homepage = () => {
    const navigate = useNavigate();
    return (
        <div className={styles['homepage-container']}>
            <h3>Welcome to the Admin Portal</h3>
            <p>Sign in to manage orders, products, and content.</p>
            <Button
                shape="round"
                onClick={() => {
                    navigate("/log-in");
                }}
            >
                Σύνδεση
            </Button>
        </div>
    );
};
export default Homepage;

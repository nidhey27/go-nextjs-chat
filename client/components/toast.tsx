import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast = ({ message, type }: { message: string, type: string }) => {
    switch (type) {
        case "success":
            toast.success(message);
            break;
        case "error":
            toast.error(message);
            break;
        default:
            break;
    }

    return <ToastContainer autoClose={1000} />;
};

export default Toast;
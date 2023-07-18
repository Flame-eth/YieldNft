import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = (message, type) => {
  toast[type](message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000, // Adjust the duration as per your preference
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

// export default showToast;

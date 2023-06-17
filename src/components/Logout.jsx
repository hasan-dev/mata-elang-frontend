import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const urlGateway = import.meta.env.VITE_URL_API_GATEWAY;

const handleLogout = () => {
  const accessToken = Cookies.get("access_token");

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Logout!",
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .post(
          `${urlGateway}/users/logout`,
          {},
          {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          }
        )
        .then(function (response) {
          Swal.fire(
            "Logout",
            "You have been logged out successfully.",
            "success"
          );
          window.location.href = "/";
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  });
};

const Logout = () => {
  useEffect(() => {
    handleLogout();
  }, []);

  return null;
};

export default Logout;

import { Button, Card, CardContent, Divider, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const urlGateway = import.meta.env.VITE_URL_API_GATEWAY;

export default function UserForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    website: "",
    address: "",
  });

  const organizationData = location.state.organizationData;
  console.log(organizationData);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userDataSubmit = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone_number: userData.phone_number,
      website: userData.website,
      address: userData.address,
      organization_ids: [organizationData.organization.id],
      role_ids: [organizationData.admin_role.id],
    };
    console.log(userDataSubmit);
    axios
      .post(`${urlGateway}/users/register_first`, userDataSubmit)
      .then(function (response) {
        console.log(response.data);
        // if (response.data.status === "success") {
        //   setCreateFlag(!createFlag);
        //   handleCloseAdd();
        // }

        navigate("/login");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <Card>
      <h1>Create User</h1>
      <Divider variant="middle" />
      <br />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <TextField
            required
            label="Name"
            fullWidth
            margin="normal"
            value={userData.name}
            onChange={(event) =>
              setUserData({
                ...userData,
                name: event.target.value,
              })
            }
          />
          <TextField
            required
            label="Email"
            fullWidth
            margin="normal"
            value={userData.email}
            onChange={(event) =>
              setUserData({
                ...userData,
                email: event.target.value,
              })
            }
          />
          <TextField
            required
            label="Password"
            fullWidth
            margin="normal"
            type="password"
            value={userData.password}
            onChange={(event) =>
              setUserData({
                ...userData,
                password: event.target.value,
              })
            }
          />
          <TextField
            required
            label="Phone Number"
            fullWidth
            margin="normal"
            value={userData.phone_number}
            onChange={(event) =>
              setUserData({
                ...userData,
                phone_number: event.target.value,
              })
            }
          />
          <TextField
            required
            label="website"
            fullWidth
            margin="normal"
            value={userData.website}
            onChange={(event) =>
              setUserData({
                ...userData,
                website: event.target.value,
              })
            }
          />
          <TextField
            required
            label="address"
            fullWidth
            margin="normal"
            value={userData.address}
            onChange={(event) =>
              setUserData({
                ...userData,
                address: event.target.value,
              })
            }
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, TextField, Button, Divider } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const urlGateway = import.meta.env.VITE_URL_API_GATEWAY;
const urlSensor = import.meta.env.VITE_URL_API_SENSOR;

const EditOrganization = () => {
  const [dataOrganization, setDataOrganization] = useState({
    name: "",
    email: "",
    address: "",
    province: "",
    city: "",
    phone_number: "",
    oinkcode: "",
  });

  const accessToken = Cookies.get("access_token");
  const navigate = useNavigate();

  if (!accessToken) {
    navigate("/login");
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const dataOrganizationSubmit = {
      name: dataOrganization.name,
      email: dataOrganization.email,
      address: dataOrganization.address,
      province: dataOrganization.province,
      city: dataOrganization.city,
      phone_number: dataOrganization.phone_number,
      oinkcode: dataOrganization.oinkcode,
      parent_id: 1,
    };

    axios
      .post(`${urlGateway}/organizations/create`, dataOrganizationSubmit, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.status, response.data);
        navigate("/login");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(`${urlGateway}/organizations/1`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        if (!accessToken) {
          navigate("/login");
        }
        setDataOrganization(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    console.log(dataOrganization);
  }, [dataOrganization]);

  return (
    <Card>
      <h1>Edit Organisasi</h1>
      <Divider variant="middle" />
      <br />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="name"
            fullWidth
            margin="normal"
            value={dataOrganization.name}
            onChange={(event) => {
              setDataOrganization({
                ...dataOrganization,
                name: event.target.value,
              });
            }}
          />
          <TextField
            required
            label="email"
            fullWidth
            margin="normal"
            value={dataOrganization.email}
            onChange={(event) => {
              setDataOrganization({
                ...dataOrganization,
                email: event.target.value,
              });
            }}
          />
          <TextField
            label="address"
            fullWidth
            margin="normal"
            value={dataOrganization.address}
            onChange={(event) => {
              setDataOrganization({
                ...dataOrganization,
                address: event.target.value,
              });
            }}
          />
          <TextField
            label="province"
            fullWidth
            margin="normal"
            value={dataOrganization.province}
            onChange={(event) => {
              setDataOrganization({
                ...dataOrganization,
                province: event.target.value,
              });
            }}
          />
          <TextField
            label="city"
            fullWidth
            margin="normal"
            value={dataOrganization.city}
            onChange={(event) => {
              setDataOrganization({
                ...dataOrganization,
                city: event.target.value,
              });
            }}
          />
          <TextField
            label="phone_number"
            fullWidth
            margin="normal"
            value={dataOrganization.phone_number}
            onChange={(event) => {
              setDataOrganization({
                ...dataOrganization,
                phone_number: event.target.value,
              });
            }}
          />
          <TextField
            label="oinkcode"
            fullWidth
            margin="normal"
            value={dataOrganization.oinkcode}
            onChange={(event) => {
              setDataOrganization({
                ...dataOrganization,
                oinkcode: event.target.value,
              });
            }}
          />
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditOrganization;

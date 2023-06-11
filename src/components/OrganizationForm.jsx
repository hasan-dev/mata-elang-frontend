import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const urlGateway = import.meta.env.VITE_URL_API_GATEWAY;

export default function OrganizationForm() {
  const [dataOrganization, setDataOrganization] = useState({
    name: "",
    email: "",
    address: "",
    province: "",
    city: "",
    phone_number: "",
    website: "",
    oinkcode: "",
  });
  const [dataRole, setDataRole] = useState({});
  const [organizationId, setOrganizationId] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataOrganizationSubmit = {
      name: dataOrganization.name,
      email: dataOrganization.email,
      address: dataOrganization.address,
      province: dataOrganization.province,
      city: dataOrganization.city,
      website: dataOrganization.website,
      phone_number: dataOrganization.phone_number,
      oinkcode: dataOrganization.oinkcode,
    };

    console.log(dataOrganizationSubmit);

    axios
      .post(`${urlGateway}/organizations/create_first`, dataOrganizationSubmit)
      .then(function (response) {
        console.log(response.data);
        // setDataOrganization(response.data.data.organization);
        // setDataRole(response.data.data.admin_role);
        // setOrganizationId(response.data.data.organization.id);
        // setSelectedRoles(response.data.data.admin_role.id);
        navigate("/user-form", {
          state: { organizationData: response.data.data },
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <Card>
      <h1>Create Your Organization</h1>
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
            label="website"
            fullWidth
            margin="normal"
            value={dataOrganization.website}
            onChange={(event) => {
              setDataOrganization({
                ...dataOrganization,
                website: event.target.value,
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
}

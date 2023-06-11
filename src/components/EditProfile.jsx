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
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const urlGateway = import.meta.env.VITE_URL_API_GATEWAY;
const urlSensor = import.meta.env.VITE_URL_API_SENSOR;

export default function EditProfile({ userId, handleClose, organizationId }) {
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    address: "",
    phone_number: "",
    website: "",
    birth_date: "",
  });
  const [userOrganization, setUserOrganization] = useState([]);
  const [userRole, setUserRole] = useState([]);
  const accessToken = Cookies.get("access_token");

  useEffect(() => {
    axios
      .get(`${urlGateway}/users/${userId}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        setDataUser(response.data.data);
        setUserOrganization(response.data.data.organization[0]);
        setUserRole(response.data.data.role);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const dataUserSubmit = {
      name: dataUser.name,
      email: dataUser.email,
      address: dataUser.address,
      phone_number: dataUser.phone_number,
      website: dataUser.website,
      birth_date: dataUser.birth_date,
    };

    axios
      .patch(`${urlGateway}/users/update_profile/${userId}`, dataUserSubmit, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data);
        handleClose();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 800,
          mx: "auto",
          my: 8,
        }}
      >
        <Typography
          variant="h2"
          align="center"
          sx={{
            marginTop: 2,
          }}
        >
          Edit Sensor
        </Typography>
        <Divider variant="middle" />
        <br />
        <CardContent>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextField
              label="name"
              fullWidth
              margin="normal"
              value={dataUser.name}
              onChange={(event) => {
                setDataUser({ ...dataUser, name: event.target.value });
              }}
            />
            <TextField
              label="email"
              fullWidth
              margin="normal"
              value={dataUser.email}
              onChange={(event) => {
                setDataUser({
                  ...dataUser,
                  external_subnet: event.target.value,
                });
              }}
            />
            <TextField
              label="address"
              fullWidth
              margin="normal"
              value={dataUser.address}
              onChange={(event) => {
                setDataUser({
                  ...dataUser,
                  address: event.target.value,
                });
              }}
            />
            <TextField
              label="phone_number"
              fullWidth
              margin="normal"
              value={dataUser.phone_number}
              onChange={(event) => {
                setDataUser({
                  ...dataUser,
                  phone_number: event.target.value,
                });
              }}
            />
            <TextField
              label="website"
              fullWidth
              margin="normal"
              value={dataUser.website}
              onChange={(event) => {
                setDataUser({
                  ...dataUser,
                  website: event.target.value,
                });
              }}
            />
            <TextField
              label="address"
              fullWidth
              margin="normal"
              value={dataUser.address}
              onChange={(event) => {
                setDataUser({
                  ...dataUser,
                  address: event.target.value,
                });
              }}
            />
            <TextField
              disabled
              // label="Organization"
              fullWidth
              margin="normal"
              value={userOrganization.name}
            />
            <Grid
              container
              spacing={2}
              sx={{
                marginTop: 1,
              }}
            >
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    fullWidth
                    label="Birth Date"
                    margin="normal"
                    value={dayjs(dataUser.birth_date)}
                    onChange={(newValue) => {
                      setDataUser({
                        ...dataUser,
                        birth_date: newValue.format("YYYY-MM-DD"),
                      });
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}></Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                marginTop: 2,
              }}
            >
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

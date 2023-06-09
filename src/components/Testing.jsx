import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function Testing() {
  const urlGateway = import.meta.env.VITE_URL_API_GATEWAY;
  const urlSensor = import.meta.env.VITE_URL_API_SENSOR;
  const accessToken = Cookies.get("access_token");
  const userId = Cookies.get("user_id");
  const [dataUser, setdataUser] = useState({
    id: "",
    name: "",
    mqtt_port: "",
    mqtt_ip: "",
    mqtt_topic: "",
    network_interface: "",
    protected_subnet: "",
    organization_id: "",
    external_subnet: "",
    oinkcode: "",
  });

  useEffect(() => {
    axios
      .get(`${urlGateway}/users/${userId}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        const organizationDatas = response.data.data.organization.map(
          (org) => ({
            id: org.id,
            name: org.name,
          })
        );

        if (!accessToken) {
          navigate("/login");
        }
        setOrganizationDatas(organizationDatas);
        setSelectedOrganizationId(1);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  return (
    <>
      <Card
        sx={{
          maxWidth: 600,
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
          Create Sensor
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
                setdataUser({ ...dataUser, name: event.target.value });
              }}
            />

            <TextField
              label="external_subnet"
              fullWidth
              margin="normal"
              value={dataUser.external_subnet}
              onChange={(event) => {
                setdataUser({
                  ...dataUser,
                  external_subnet: event.target.value,
                });
              }}
            />
            <TextField
              label="protected_subnet"
              fullWidth
              margin="normal"
              value={dataUser.protected_subnet}
              onChange={(event) => {
                setdataUser({
                  ...dataUser,
                  protected_subnet: event.target.value,
                });
              }}
            />
            <TextField
              label="mqtt_topic"
              fullWidth
              margin="normal"
              value={dataUser.mqtt_topic}
              onChange={(event) => {
                setdataUser({
                  ...dataUser,
                  mqtt_topic: event.target.value,
                });
              }}
            />
            <TextField
              label="mqtt_ip"
              fullWidth
              margin="normal"
              value={dataUser.mqtt_ip}
              onChange={(event) => {
                setdataUser({ ...dataUser, mqtt_ip: event.target.value });
              }}
            />
            <TextField
              label="mqtt_port"
              fullWidth
              margin="normal"
              value={dataUser.mqtt_port}
              onChange={(event) => {
                setdataUser({ ...dataUser, mqtt_port: event.target.value });
              }}
            />
            <TextField
              label="network_interface"
              fullWidth
              margin="normal"
              value={dataUser.network_interface}
              onChange={(event) => {
                setdataUser({
                  ...dataUser,
                  network_interface: event.target.value,
                });
              }}
            />
            <TextField
              label="oinkcode"
              fullWidth
              margin="normal"
              value={dataUser.oinkcode}
              onChange={(event) => {
                setdataUser({
                  ...dataUser,
                  oinkcode: event.target.value,
                });
              }}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="medium"
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

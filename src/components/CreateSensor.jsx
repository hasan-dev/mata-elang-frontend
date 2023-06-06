import {
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Typography,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const urlGateway = import.meta.env.VITE_URL_API_GATEWAY;
const urlSensor = import.meta.env.VITE_URL_API_SENSOR;

const CreateSensor = () => {
  const [dataSensor, setDataSensor] = useState({
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
  const [organizationDatas, setOrganizationDatas] = useState([{}]);
  // const organiza
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
  const accessToken = Cookies.get("access_token");
  const userId = Cookies.get("user_id");
  const navigate = useNavigate();

  if (!accessToken) {
    navigate("/all-sensor");
  }

  const handleOrganizationChange = (selectedOrgId) => {
    setDataSensor({ ...dataSensor, organization_id: selectedOrgId });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const dataSensorSubmit = {
      id: dataSensor.id,
      name: dataSensor.name,
      mqtt_port: dataSensor.mqtt_port,
      mqtt_ip: dataSensor.mqtt_ip,
      mqtt_topic: dataSensor.mqtt_topic,
      network_interface: dataSensor.network_interface,
      protected_subnet: dataSensor.protected_subnet,
      organization_id: selectedOrganizationId,
      external_subnet: dataSensor.external_subnet,
      oinkcode: dataSensor.oinkcode,
    };

    axios
      .post(`${urlGateway}/sensors/register`, dataSensorSubmit, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data);
        navigate("/dashboard/all-sensor");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

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
        setSelectedOrganizationId(organizationDatas[0].id);
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
              value={dataSensor.name}
              onChange={(event) => {
                setDataSensor({ ...dataSensor, name: event.target.value });
              }}
            />

            <TextField
              label="external_subnet"
              fullWidth
              margin="normal"
              value={dataSensor.external_subnet}
              onChange={(event) => {
                setDataSensor({
                  ...dataSensor,
                  external_subnet: event.target.value,
                });
              }}
            />
            <TextField
              label="protected_subnet"
              fullWidth
              margin="normal"
              value={dataSensor.protected_subnet}
              onChange={(event) => {
                setDataSensor({
                  ...dataSensor,
                  protected_subnet: event.target.value,
                });
              }}
            />
            <TextField
              label="mqtt_topic"
              fullWidth
              margin="normal"
              value={dataSensor.mqtt_topic}
              onChange={(event) => {
                setDataSensor({
                  ...dataSensor,
                  mqtt_topic: event.target.value,
                });
              }}
            />
            <TextField
              label="mqtt_ip"
              fullWidth
              margin="normal"
              value={dataSensor.mqtt_ip}
              onChange={(event) => {
                setDataSensor({ ...dataSensor, mqtt_ip: event.target.value });
              }}
            />
            <TextField
              label="mqtt_port"
              fullWidth
              margin="normal"
              value={dataSensor.mqtt_port}
              onChange={(event) => {
                setDataSensor({ ...dataSensor, mqtt_port: event.target.value });
              }}
            />
            <TextField
              label="network_interface"
              fullWidth
              margin="normal"
              value={dataSensor.network_interface}
              onChange={(event) => {
                setDataSensor({
                  ...dataSensor,
                  network_interface: event.target.value,
                });
              }}
            />
            <TextField
              label="oinkcode"
              fullWidth
              margin="normal"
              value={dataSensor.oinkcode}
              onChange={(event) => {
                setDataSensor({
                  ...dataSensor,
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
};

export default CreateSensor;

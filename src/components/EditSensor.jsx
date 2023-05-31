import {
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Typography,
  Link,
} from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";

const EditSensor = ({ props }) => {
  let { sensorId } = useParams();
  console.log(sensorId);

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
  });

  const accessToken = Cookies.get("access_token");
  const navigate = useNavigate();

  if (!accessToken) {
    navigate("/all-sensor");
  }

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
      organization_id: dataSensor.organization_id,
      external_subnet: dataSensor.external_subnet,
    };

    axios
      .patch(
        `http://127.0.0.1:8001/api/sensors/update/${props}`,
        dataSensorSubmit,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      )
      .then(function (response) {
        console.log(response.status, response.data);
        navigate("/all-sensor");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8001/api/sensors/${props}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        if (!accessToken) {
          navigate("/login");
        }
        setDataSensor(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    console.log(dataSensor);
  }, [dataSensor]);

  return (
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
            value={dataSensor.name}
            onChange={(event) => {
              setDataSensor({ ...dataSensor, name: event.target.value });
            }}
          />
          <TextField
            required
            label="organization_id"
            fullWidth
            margin="normal"
            value={dataSensor.organization_id}
            onChange={(event) => {
              setDataSensor({
                ...dataSensor,
                organization_id: event.target.value,
              });
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
              setDataSensor({ ...dataSensor, mqtt_topic: event.target.value });
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
        <Typography
          variant="body2"
          align="center"
          style={{ marginTop: "16px" }}
        >
          Upload Rules?{" "}
          <Link
            component="button"
            onClick={() => {
              navigate(`/upload-rules/${sensorId}`);
            }}
          >
            Click Here
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EditSensor;

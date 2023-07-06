import {
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  MenuItem,
  Chip,
  Stack,
  OutlinedInput,
  Select,
  Typography,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";

import CancelIcon from "@mui/icons-material/Cancel";

const urlGateway = import.meta.env.VITE_URL_API_GATEWAY;
const urlSensor = import.meta.env.VITE_URL_API_SENSOR;

const EditAsset = ({
  assetId,
  organizationId,
  handleCloseEdit,
  editFlag,
  setEditFlag,
}) => {
  const [dataAsset, setDataAsset] = useState({
    name: "",
    location: "",
    as_number: "",
    dns: "",
    organization_id: "",
    sensor_id: "",
    pic: "",
    description: "",
  });
  const [sensorData, setSensorData] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState([]);
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);

  const accessToken = Cookies.get("access_token");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const dataAssetSubmit = {
      name: dataAsset.name,
      location: dataAsset.location,
      as_number: dataAsset.as_number,
      dns: dataAsset.dns,
      organization_id: organizationId,
      sensor_id: selectedSensor[0],
      pic: selectedUser[0],
      description: dataAsset.description,
    };

    console.log(dataAssetSubmit);
    axios
      .patch(`${urlGateway}/assets/update/${assetId}`, dataAssetSubmit, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data);
        if (response.data.message === "updated") {
          setEditFlag(!editFlag);
          handleCloseEdit(assetId);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(`${urlGateway}/assets/${assetId}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        if (!accessToken) {
          navigate("/login");
        }
        setDataAsset(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${urlGateway}/organizations/${organizationId}/sensors/all`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        setSensorData(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${urlGateway}/organizations/${organizationId}/users/all`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        setUserData(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

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
          Create Asset
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
              value={dataAsset.name}
              onChange={(event) => {
                setDataAsset({
                  ...dataAsset,
                  name: event.target.value,
                });
              }}
            />
            <TextField
              label="description"
              fullWidth
              margin="normal"
              value={dataAsset.description}
              onChange={(event) => {
                setDataAsset({
                  ...dataAsset,
                  description: event.target.value,
                });
              }}
            />
            <TextField
              label="dns"
              fullWidth
              margin="normal"
              value={dataAsset.dns}
              onChange={(event) => {
                setDataAsset({
                  ...dataAsset,
                  dns: event.target.value,
                });
              }}
            />
            <TextField
              label="as_number"
              fullWidth
              margin="normal"
              value={dataAsset.as_number}
              onChange={(event) => {
                setDataAsset({
                  ...dataAsset,
                  as_number: event.target.value,
                });
              }}
            />
            <TextField
              label="location"
              fullWidth
              margin="normal"
              value={dataAsset.location}
              onChange={(event) => {
                setDataAsset({
                  ...dataAsset,
                  location: event.target.value,
                });
              }}
            />
            <InputLabel
              sx={{
                alignSelf: "flex-start",
              }}
            >
              Select User as PIC
            </InputLabel>
            <Select
              multiple
              fullWidth
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              input={<OutlinedInput label="Select" />}
              renderValue={(selected) => (
                <Stack gap={1} direction="row" flexWrap="wrap">
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={userData.find((user) => user.id === value)?.name}
                      onDelete={() =>
                        setSelectedUser(
                          selectedUser.filter((item) => item !== value)
                        )
                      }
                      deleteIcon={
                        <CancelIcon
                          onMouseDown={(event) => event.stopPropagation()}
                        />
                      }
                    />
                  ))}
                </Stack>
              )}
            >
              {userData.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
            <InputLabel
              sx={{
                alignSelf: "flex-start",
              }}
            >
              Select One Sensor
            </InputLabel>
            <Select
              multiple
              fullWidth
              value={selectedSensor}
              onChange={(e) => setSelectedSensor(e.target.value)}
              input={<OutlinedInput label="Select" />}
              renderValue={(selected) => (
                <Stack gap={1} direction="row" flexWrap="wrap">
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={
                        sensorData.find((sensor) => sensor.id === value)?.name
                      }
                      onDelete={() =>
                        setSelectedSensor(
                          selectedSensor.filter((item) => item !== value)
                        )
                      }
                      deleteIcon={
                        <CancelIcon
                          onMouseDown={(event) => event.stopPropagation()}
                        />
                      }
                    />
                  ))}
                </Stack>
              )}
            >
              {sensorData.map((sensor) => (
                <MenuItem key={sensor.id} value={sensor.id}>
                  {sensor.name}
                </MenuItem>
              ))}
            </Select>
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
};

export default EditAsset;

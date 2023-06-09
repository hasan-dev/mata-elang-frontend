import {
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";

const urlGateway = import.meta.env.VITE_URL_API_GATEWAY;
const urlSensor = import.meta.env.VITE_URL_API_SENSOR;

export default function CreateUser({ handleCloseAdd, organizationId }) {
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    organization_ids: [],
    role_ids: [],
  });
  const [organizationDatas, setOrganizationDatas] = useState([{}]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
  const accessToken = Cookies.get("access_token");
  const userId = Cookies.get("user_id");
  const [selectedNames, setSelectedNames] = useState([]);
  const [rolesData, setRoleData] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const dataUserSubmit = {
      name: dataUser.name,
      email: dataUser.email,
      password: dataUser.password,
      phone_number: dataUser.phone_number,
      organization_ids: [selectedOrganizationId],
      role_ids: selectedRoles,
    };
    // console.log(dataUserSubmit);
    axios
      .post(
        `${urlGateway}/organizations/${organizationId}/users/register`,
        dataUserSubmit,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      )
      .then(function (response) {
        console.log(response.data);
        if (response.status === "success") {
          handleCloseAdd();
        }

        // navigate("/dashboard/all-sensor");
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

        setOrganizationDatas(organizationDatas);
        setSelectedOrganizationId(organizationId);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${urlGateway}/organizations/${organizationId}/roles/all`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        setRoleData(response.data.data);
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
          Create User
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
              type={"email"}
              value={dataUser.email}
              onChange={(event) => {
                setDataUser({
                  ...dataUser,
                  email: event.target.value,
                });
              }}
            />
            <TextField
              label="password"
              fullWidth
              margin="normal"
              type={"password"}
              value={dataUser.password}
              onChange={(event) => {
                setDataUser({
                  ...dataUser,
                  password: event.target.value,
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
            <InputLabel
              sx={{
                alignSelf: "flex-start",
              }}
            >
              Multiple Select
            </InputLabel>
            <Select
              multiple
              fullWidth
              value={selectedRoles}
              onChange={(e) => setSelectedRoles(e.target.value)}
              input={<OutlinedInput label="Multiple Select" />}
              renderValue={(selected) => (
                <Stack gap={1} direction="row" flexWrap="wrap">
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={rolesData.find((role) => role.id === value)?.name}
                      onDelete={() =>
                        setSelectedRoles(
                          selectedRoles.filter((item) => item !== value)
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
              {rolesData.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
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

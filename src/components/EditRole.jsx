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

export default function EditRole({ roleId, handleCloseEdit, organizationId }) {
  const [userData, setuserData] = useState([]);
  const [dataRole, setDataRole] = useState({
    name: "",
    email: "",
    organization_id: "",
    role_ids: [],
  });
  const accessToken = Cookies.get("access_token");
  const userId = Cookies.get("user_id");
  const [permissionData, setPermissionData] = useState([]);
  const [selectedPermission, setselectedPermission] = useState([]);
  const [organizationData, setOrganizationData] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const dataRoleSubmit = {
      name: dataRole.name,
      organization_id: organizationId,
      permission_ids: selectedPermission,
    };

    axios
      .patch(`${urlGateway}/roles/update/${roleId}`, dataRoleSubmit, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data);
        if (response.status === "success") {
          handleCloseEdit();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(`${urlGateway}/roles/${roleId}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        const role = response.data.data;
        setDataRole(role);
        setselectedPermission(
          role.permissions.map((permission) => permission.id)
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${urlGateway}/permissions/all`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        setPermissionData(response.data.data);
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
          Create Role
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
              value={dataRole.name}
              onChange={(event) => {
                setDataRole({ ...dataRole, name: event.target.value });
              }}
            />
            <InputLabel
              sx={{
                alignSelf: "flex-start",
              }}
            >
              Permission
            </InputLabel>
            <Select
              multiple
              fullWidth
              value={selectedPermission}
              onChange={(e) => setselectedPermission(e.target.value)}
              input={<OutlinedInput label="Multiple Select" />}
              renderValue={(selected) => (
                <Stack gap={1} direction="row" flexWrap="wrap">
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={
                        permissionData.find((role) => role.id === value)?.name
                      }
                      onDelete={() =>
                        setselectedPermission(
                          selectedPermission.filter((item) => item !== value)
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
              {permissionData.map((role) => (
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

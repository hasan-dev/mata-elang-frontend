import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Modal,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditUser from "./EditUser";
import EditProfile from "./EditProfile";

const urlGateway = import.meta.env.VITE_URL_API_GATEWAY;
const urlSensor = import.meta.env.VITE_URL_API_SENSOR;

const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const accessToken = Cookies.get("access_token");
  const id = Cookies.get("user_id");
  const organizationId = Cookies.get("organization_id");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [userOrganization, setUserOrganization] = useState([]);
  const [userRole, setUserRole] = useState([]);

  useEffect(() => {
    axios
      .get(`${urlGateway}/users/${id}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        setUserData(response.data.data);
        setUserOrganization(response.data.data.organization[0]);
        setUserRole(response.data.data.role);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          bgcolor: "background.paper",
          border: 1,
          borderColor: "grey.500",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          borderRadius: "16px",
          boxShadow: 3,
          mt: 10,
        }}
      >
        <Card sx={{ maxWidth: 500 }}>
          {console.log(userData)}
          <CardActionArea>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Name:</Typography>
                  <Typography>{userData.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Email:</Typography>
                  <Typography>{userData.email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Phone Number:</Typography>
                  <Typography>{userData.phone_number}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Website:</Typography>
                  <Typography>{userData.website}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Address:</Typography>
                  <Typography>{userData.address}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Birth Date:</Typography>
                  <Typography>{userData.birth_date}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Organization:</Typography>
                  <Typography>{userOrganization.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Role : </Typography>
                  {userRole.map((role) => (
                    <Typography key={role.id}>{role.name}</Typography>
                  ))}
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpen}
                  >
                    Edit Profile
                  </Button>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <EditProfile
                      userId={id}
                      handleClose={handleClose}
                      organizationId={organizationId}
                    />
                  </Modal>
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>

      {/* <Box>
          <Card
            sx={{
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <CardHeader
              sx={{ textAlign: "center", backgroundColor: "#F5F5F5" }}
              title="Organization"
            />
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "row",
                p: 4,
              }}
            >
              {userData.organization &&
                userData.organization.map((org) => (
                  <Box
                    key={org.id}
                    sx={{
                      marginBottom: "1.5rem",
                      mx: 4,
                      padding: "1.5rem",
                      background:
                        "linear-gradient(to bottom, #FFFFFF, #F5F5F5)",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography variant="h6">{org.name}</Typography>
                    <Box sx={{ marginTop: "1rem" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ marginBottom: "0.5rem" }}
                      >
                        Email:
                      </Typography>
                      <Typography>{org.email}</Typography>
                    </Box>
                    <Box sx={{ marginTop: "1rem" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ marginBottom: "0.5rem" }}
                      >
                        Address:
                      </Typography>
                      <Typography>{org.address}</Typography>
                    </Box>
                    <Box sx={{ marginTop: "1rem" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ marginBottom: "0.5rem" }}
                      >
                        Province:
                      </Typography>
                      <Typography>{org.province}</Typography>
                    </Box>
                    <Box sx={{ marginTop: "1rem" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ marginBottom: "0.5rem" }}
                      >
                        City:
                      </Typography>
                      <Typography>{org.city}</Typography>
                    </Box>
                    <Box sx={{ marginTop: "1rem" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ marginBottom: "0.5rem" }}
                      >
                        Phone Number:
                      </Typography>
                      <Typography>{org.phone_number}</Typography>
                    </Box>
                    <Box sx={{ marginTop: "1rem" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ marginBottom: "0.5rem" }}
                      >
                        Website:
                      </Typography>
                      <Typography>{org.website}</Typography>
                    </Box>
                  </Box>
                ))}
            </CardContent>
          </Card>
        </Box> */}
    </>
  );
};

export default ProfilePage;

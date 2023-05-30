import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const [userData, setUserData] = useState([]);
  const accessToken = Cookies.get("access_token");
  const navigate = useNavigate();
  const id = Cookies.get("user_id");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8001/api/users/${id}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        if (!accessToken) {
          navigate("/login");
        }
        setUserData(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box sx={{ width: 400, margin: "0 1rem" }}>
        <Card sx={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
          <CardHeader sx={{ textAlign: "center" }} title="Profile" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Avatar sx={{ width: 120, height: 120, margin: "0 auto" }}>
                  <img src={userData.photo} alt="Profile Avatar" />
                </Avatar>
              </Grid>
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
                <Button variant="contained" color="primary">
                  Edit Profile
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ width: 400, margin: "0 1rem" }}>
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
          <CardContent>
            {userData.organization &&
              userData.organization.map((org) => (
                <Box
                  key={org.id}
                  sx={{
                    marginBottom: "1.5rem",
                    padding: "1.5rem",
                    background: "linear-gradient(to bottom, #FFFFFF, #F5F5F5)",
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
      </Box>
    </Box>
  );
};

export default ProfilePage;

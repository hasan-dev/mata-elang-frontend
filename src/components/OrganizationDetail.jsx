import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const urlGateway = import.meta.env.VITE_URL_API_GATEWAY;
const urlSensor = import.meta.env.VITE_URL_API_SENSOR;

export default function OrganizationDetail() {
  const [dataOrganization, setDataOrganization] = useState({
    name: "",
    email: "",
    address: "",
    province: "",
    city: "",
    phone_number: "",
    oinkcode: "",
  });
  const accessToken = Cookies.get("access_token");
  const userId = Cookies.get("user_id");
  const navigate = useNavigate();

  if (!accessToken) {
    navigate("/login");
  }

  useEffect(() => {
    axios
      .get(`${urlGateway}/users/${userId}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data.data.organization[0]);
        if (!accessToken) {
          navigate("/login");
        }
        setDataOrganization(response.data.data.organization[0]);
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
        <Box
          sx={{
            padding: 3,
          }}
        >
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
              <Box
                key={dataOrganization.id}
                sx={{
                  marginBottom: "1.5rem",
                  mx: 4,
                  padding: "1.5rem",
                  background: "linear-gradient(to bottom, #FFFFFF, #F5F5F5)",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <Typography variant="h6">{dataOrganization.name}</Typography>
                <Box sx={{ marginTop: "1rem" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ marginBottom: "0.5rem" }}
                  >
                    Email:
                  </Typography>
                  <Typography>{dataOrganization.email}</Typography>
                </Box>
                <Box sx={{ marginTop: "1rem" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ marginBottom: "0.5rem" }}
                  >
                    Address:
                  </Typography>
                  <Typography>{dataOrganization.address}</Typography>
                </Box>
                <Box sx={{ marginTop: "1rem" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ marginBottom: "0.5rem" }}
                  >
                    Province:
                  </Typography>
                  <Typography>{dataOrganization.province}</Typography>
                </Box>
                <Box sx={{ marginTop: "1rem" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ marginBottom: "0.5rem" }}
                  >
                    City:
                  </Typography>
                  <Typography>{dataOrganization.city}</Typography>
                </Box>
                <Box sx={{ marginTop: "1rem" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ marginBottom: "0.5rem" }}
                  >
                    Phone Number:
                  </Typography>
                  <Typography>{dataOrganization.phone_number}</Typography>
                </Box>
                <Box sx={{ marginTop: "1rem" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ marginBottom: "0.5rem" }}
                  >
                    Website:
                  </Typography>
                  <Typography>{dataOrganization.website}</Typography>
                </Box>
              </Box>
              {/* ))} */}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
}

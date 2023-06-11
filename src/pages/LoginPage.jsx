// import React from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CardHeader,
  Avatar,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import { Link, Navigate, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [dataLogin, setDataLogin] = useState({
    email: "",
    password: "",
  });
  const urlGateway = import.meta.env.VITE_URL_API_GATEWAY;
  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");
  //   const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    history.push("/register");
  };

  const postLogin = (e) => {
    e.preventDefault();
    axios
      .post(`${urlGateway}/users/login`, dataLogin)
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          Cookies.set("access_token", response.data.access_token);
          Cookies.set("user_id", response.data.data.id);
          Cookies.set("organization_id", response.data.data.organization[0].id);

          navigate("/dashboard");
        } else {
          console.log(response.data.message);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  //   console.log(dataLogin);
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
      <Card style={{ width: 400 }}>
        <CardHeader
          avatar={<Avatar src="/logo.jpeg" sx={{ width: 64, height: 64 }} />}
          title={
            <Typography variant="h4" my="auto" mr={4}>
              Mata Elang
            </Typography>
          }
        />
        <CardContent>
          <form onSubmit={postLogin}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={dataLogin.email}
              onChange={(e) =>
                setDataLogin({ ...dataLogin, email: e.target.value })
              }
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={dataLogin.password}
              onChange={(e) =>
                setDataLogin({ ...dataLogin, password: e.target.value })
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: 20 }}
            >
              Login
            </Button>
          </form>
          <Typography
            variant="body2"
            align="center"
            style={{ marginTop: "16px" }}
          >
            Didnt Have Account? <Link to="/register">Click Here</Link>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;

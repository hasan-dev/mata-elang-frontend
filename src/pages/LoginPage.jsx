// import React from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [dataLogin, setDataLogin] = useState({
    email: "",
    password: "",
  });

  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");
  //   const [error, setError] = useState("");
  const navigate = useNavigate();
  const postLogin = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8001/api/users/login", dataLogin)
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          // Simpan access_token ke dalam cookie
          Cookies.set("access_token", response.data.access_token);

          // Lanjutkan ke halaman selanjutnya
          navigate("/all-sensor");
        } else {
          // Tampilkan pesan error
          console.log(response.data.message);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  //   const handleSubmit = (event) => {
  // event.preventDefault          </Route>();

  //     axios
  //       .post("http://localhost:8001/api/users/login", { email, password })
  //       .then((response) => {
  //         // handle successful login here
  //         console.log(response);
  //       })
  //       .catch((error) => {
  //         setError("Invalid email or password.");
  //         console.log(error);
  //       });
  //   };

  //   console.log(dataLogin);
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
      <Card style={{ width: 400 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Login
          </Typography>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;

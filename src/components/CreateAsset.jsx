import { Card, CardContent, TextField, Button, Divider } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const CreateAsset = () => {
  const [dataAsset, setDataAsset] = useState({
    name: "",
    organization_id: "",
    sensor_id: "",
    pic: "",
    description: "",
  });

  const accessToken = Cookies.get("access_token");
  const navigate = useNavigate();

  if (!accessToken) {
    // Jika access_token tidak ada, kembalikan ke halaman login
    navigate("/login");
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // handle form submit here
    const dataAssetSubmit = {
      name: dataAsset.name,
      organization_id: dataAsset.organization_id,
      sensor_id: dataAsset.sensor_id,
      pic: dataAsset.pic,
      description: dataAsset.description,
    };

    axios
      .post("http://127.0.0.1:8001/api/assets/register", dataAssetSubmit, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.status, response.data);
        navigate("/all-asset");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <Card>
      <h1>Create Asset</h1>
      <Divider variant="middle" />
      <br />
      <CardContent>
        <form onSubmit={handleSubmit}>
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
            required
            label="organization_id"
            fullWidth
            margin="normal"
            value={dataAsset.organization_id}
            onChange={(event) => {
              setDataAsset({
                ...dataAsset,
                organization_id: event.target.value,
              });
            }}
          />
          <TextField
            label="sensor_id"
            fullWidth
            margin="normal"
            value={dataAsset.sensor_id}
            onChange={(event) => {
              setDataAsset({
                ...dataAsset,
                sensor_id: event.target.value,
              });
            }}
          />
          <TextField
            label="pic_id"
            fullWidth
            margin="normal"
            value={dataAsset.pic}
            onChange={(event) => {
              setDataAsset({
                ...dataAsset,
                pic: event.target.value,
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
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateAsset;

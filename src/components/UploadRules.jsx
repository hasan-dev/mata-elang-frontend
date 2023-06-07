import { useState } from "react";
import {
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Typography,
  Divider,
  Modal,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const urlGateway = import.meta.env.VITE_URL_API_GATEWAY;
const urlSensor = import.meta.env.VITE_URL_API_SENSOR;

const UploadRules = ({ sensorId, handleCloseUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    axios
      .post(`${urlSensor}/sensors/update_rule/${sensorId}`, formData)
      .then((response) => {
        console.log(response);
        handleCloseUpload(sensorId);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        // Tangani kesalahan jika terjadi
      });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" align="center" gutterBottom>
          Upload Rules
        </Typography>
        <Divider variant="middle" />
        <br />
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField type="file" fullWidth onChange={handleFileChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" onClick={handleUpload} fullWidth>
              Upload
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
    // </Modal>
  );
};

export default UploadRules;

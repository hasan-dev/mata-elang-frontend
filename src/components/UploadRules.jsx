import { useState } from "react";
import {
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const UploadRules = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  let { sensorId } = useParams();
  console.log(sensorId);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    axios
      .post(
        `http://127.0.0.1:8002/api/sensors/update_rule/${sensorId}`,
        formData
      )
      .then((response) => {
        console.log(response);
        // Lakukan tindakan lain setelah upload berhasil
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
  );
};

export default UploadRules;

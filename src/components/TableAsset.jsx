import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import { Card, Divider } from "@mui/material";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function TableAsset() {
  const [assetData, setAssetData] = useState([]);
  const accessToken = Cookies.get("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    // event.preventDefault();
    // handle form submit here
    console.log(accessToken);
    axios
      .get("http://127.0.0.1:8001/api/organizations/1/assets/all", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        if (!accessToken) {
          // Jika access_token tidak ada, kembalikan ke halaman login
          navigate("/login");
        }
        setAssetData(response.data.data);
        // console.log(assetData);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    console.log(assetData);
  }, [assetData]);

  return (
    <Card sx={{ minWidth: 275 }}>
      <h1>Asset</h1>
      <Divider variant="middle" />
      <br />
      <TableContainer component={Paper}>
        <Table
          sx={{
            minWidth: 650,
            "& th": {
              color: "white",
              backgroundColor: "grey",
            },
          }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="right">Id</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">PIC</TableCell>
              <TableCell align="right">Sensor Name</TableCell>
              <TableCell align="right">Organization Name</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assetData.map((asset) => (
              <TableRow
                key={asset.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right">{asset.id}</TableCell>
                <TableCell align="right">{asset.name}</TableCell>
                <TableCell align="right">{asset.description}</TableCell>
                <TableCell align="right">{asset.user_name}</TableCell>
                <TableCell align="right">{asset.sensor_name}</TableCell>
                <TableCell align="right">{asset.organization_name}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                    <Link to={`/form-edit-asset/${asset.id}`}>
                      <Button variant="contained" endIcon={<EditIcon />}>
                        Edit
                      </Button>
                    </Link>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

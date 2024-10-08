import React, { useState, useEffect } from "react";
import ApiService from "../../core/services/ApiService";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import FormControl from "@mui/material/FormControl";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { height } from "@mui/system";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, [currentPage, perPage]); // Her sayfa değiştiğinde veriyi yenile

  const fetchData = async () => {
    try {
      ApiService.get(`users?page=${currentPage}&limit=${perPage}`)
        .then((res) => {
          console.log("res :>> ", res);
          console.log("res.value.data :>> ", res.data.value.data.data);
          setUsers(res.data.value.data.data);
          setTotalPages(Math.ceil(res.data.value.data.total / perPage));
        })
        .catch((err) => {
          console.log("err :>> ", err);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="container mt-4">
      <div className="table-responsive">
        <table className="table table-hover" >
          <thead className="thead-light">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Email</th>
              <th scope="col">Password</th>
            </tr>
          </thead>
          <tbody >
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      <div className="d-flex justify-content-end align-items-center">
        <FormControl sx={{ m: 1, minWidth: 60 }} size="small">
          <Select
            size="small"
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={perPage}
            onChange={(e) => setPerPage(e.target.value)}
            autoWidth
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={10}>10</MenuItem>
          </Select>
        </FormControl>
        <Stack spacing={2} className="d-flex justify-content-center ">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      </div>
    </div>
  );
};

export default UserList;

import {
  Typography,
  TextField,
  Box,
  Button,
} from "@mui/material";

import { useState, useEffect } from "react";

import {DataGrid, GridColDef} from "@mui/x-data-grid";

function useDebounce(value: string, delay: number){

  const [inputValue, setInputValue] = useState(value);

  useEffect( () => {
    const delayInputTime = setTimeout( () => 
      setInputValue(value), delay);
      return () => clearTimeout(delayInputTime);
  }, [value, delay]);

  return inputValue;
}

interface CustomerListQueryResponse {
    id: number;
    name: string;
    address: string;
    email: string;
    phone: string;
    iban: string;
    categoryCode?: string;
    categoryDescription?: string;
}


export default function CustomerListPage() {
    const [list, setList] = useState<CustomerListQueryResponse[]>([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const debouncedName = useDebounce(name, 500);
    const debouncedEmail = useDebounce(email, 500);

    useEffect( () => {
        const params = new URLSearchParams();
        if(debouncedName)
        params.append("name", debouncedName);

        if(debouncedEmail)
        params.append("email", debouncedEmail);

        fetch(`/api/customers/list?${params.toString()}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            setList(data as CustomerListQueryResponse[]);
        });
    }, [debouncedName, debouncedEmail]);

    const handleExport = () => {
        const params = new URLSearchParams();

        if(name)
        params.append("name", name);
        if(email)
        params.append("email",email);
        fetch(`/api/customers/export?${params.toString()}`)
        .then((response) => response.blob())
        .then(blob => {
          const downloadUrl = window.URL.createObjectURL(blob);

          const a = document.createElement('a');

          a.href = downloadUrl;

          a.download = "customers.xml";

          a.click();
        });
    };

    const columns: GridColDef[] = [
      {field: "name", headerName: "Name", flex: 1},
      {field: "address", headerName: "Address", flex: 1},
      {field: "email", headerName: "Email", flex: 1},
      {field: "phone", headerName: "Phone", flex: 1},
      {field: "iban", headerName: "Iban", flex: 1},
      {field: "categoryCode", headerName: "Code", flex: 1},
      {field: "categoryDescription", headerName: "Description", flex: 1}
    ];

    return (
    <>
      <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
        Customers
      </Typography>

      <Box sx={{ display: "flex", gap:3, mb: 4}}>
        <TextField
        label="Filter by Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        ></TextField>
        <TextField
        label="Filter by Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        ></TextField>
        <Button variant="contained" sx={{ml:"auto"}} onClick={handleExport}>Export XML</Button>
      </Box>

      <div style={{height: 600, width: "100%"}}>
        <DataGrid
        rows={list}
        columns={columns}
        pageSizeOptions={[5, 10, 25, 50]}
        pagination
        ></DataGrid>
      </div>
    </>
    );
}

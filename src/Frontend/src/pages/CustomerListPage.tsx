import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Box,
  styled,
  tableCellClasses,
  Button,
} from "@mui/material";

import { useState, useEffect } from "react";

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

    const debouncedName = useDebounce(name, 1000);
    const debouncedEmail = useDebounce(email, 1000);

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

       <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} aria-label = "simple table">
            <TableHead>
                <TableRow>
                    <StyledTableHeadCell>Name</StyledTableHeadCell>
                    <StyledTableHeadCell>Address</StyledTableHeadCell>
                    <StyledTableHeadCell>Email</StyledTableHeadCell>
                    <StyledTableHeadCell>Phone</StyledTableHeadCell>
                    <StyledTableHeadCell>Iban</StyledTableHeadCell>
                    <StyledTableHeadCell>Code</StyledTableHeadCell>
                    <StyledTableHeadCell>Description</StyledTableHeadCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {list.map((row) => (
                    <TableRow key={row.id}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.address}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.phone}</TableCell>
                        <TableCell>{row.iban}</TableCell>
                        <TableCell>{row.categoryCode}</TableCell>
                        <TableCell>{row.categoryDescription}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </TableContainer>
    </>
    );
  }

  const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
  },
}));



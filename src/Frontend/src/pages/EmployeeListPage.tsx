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

import {useState, useEffect} from "react";

interface EmployeesListQueryResponse{
    id: number;
    code: string;
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    phone: string;
    department: {
        code: string;
        description: string;
    };
}

export default function EmployeeListPage() {

    const [list, setList] = useState<EmployeesListQueryResponse[]>([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    useEffect( () => {
        fetch(`/api/employees/list?firstName=${firstName}&lastName=${lastName}`)
        .then((response) => response.json())
        .then((data) => {
            setList(data as EmployeesListQueryResponse[])
        });
        }, [firstName, lastName]);

    const handleExport = () => {
        fetch(`api/employees/export?firstName=${firstName}&lastName=${lastName}`)
        .then((response) => response.blob())
        .then(blob => {
            const downloadUrl = window.URL.createObjectURL(blob);

            const a = document.createElement('a');

            a.href = downloadUrl;

            a.download = "customers.xml";

            a.click();
        });
    }

    return (
    <>
    <Typography variant="h4" sx={{textAlign: "center", mt: 4, mb: 4}}>
        Employees
    </Typography>

    <Box sx={{display: "flex", gap: 3, mb: 4}}>
        <TextField
        label = "Filter by First Name"
        value = {firstName}
        onChange = {(e) => setFirstName(e.target.value)}
        ></TextField>
        <TextField
        label = "Filter by Last Name"
        value = {lastName}
        onChange={(e) => setLastName(e.target.value)}
        ></TextField>
        <Button variant="contained" sx={{ml: "auto"}} onClick={handleExport}>Export XML</Button>
    </Box>

    <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} aria-label = "simple table">
            <TableHead>
                <TableRow>
                    <StyledTableHeadCell>Code</StyledTableHeadCell>
                    <StyledTableHeadCell>FirstName</StyledTableHeadCell>
                    <StyledTableHeadCell>LastName</StyledTableHeadCell>
                    <StyledTableHeadCell>Address</StyledTableHeadCell>
                    <StyledTableHeadCell>Email</StyledTableHeadCell>
                    <StyledTableHeadCell>Phone</StyledTableHeadCell>
                    <StyledTableHeadCell>DepartmentCode</StyledTableHeadCell>
                    <StyledTableHeadCell>Description</StyledTableHeadCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {list.map((row) => (
                    <TableRow key = {row.id}>
                        <TableCell>{row.code}</TableCell>
                        <TableCell>{row.firstName}</TableCell>
                        <TableCell>{row.lastName}</TableCell>
                        <TableCell>{row.address}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.phone}</TableCell>
                        <TableCell>{row.department?.code}</TableCell>
                        <TableCell>{row.department?.description}</TableCell>
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
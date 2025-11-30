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

function useDebounce(value: string, delay: number){

  const [inputValue, setInputValue] = useState(value);

  useEffect( () => {
    const delayInputTime = setTimeout( () => 
      setInputValue(value), delay);
      return () => clearTimeout(delayInputTime);
  }, [value, delay]);

  return inputValue;
}


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

    const debouncedFirstName = useDebounce(firstName, 1000);
    const debouncedLastName = useDebounce(lastName, 1000);

    useEffect( () => {
        const params = new URLSearchParams();
        if(debouncedFirstName)
        params.append("firstName", debouncedFirstName);

        if(debouncedLastName)
        params.append("lastName", debouncedLastName);
        fetch(`/api/employees/list?${params.toString()}`)
        .then((response) => response.json())
        .then((data) => {
            setList(data as EmployeesListQueryResponse[])
        });
        }, [debouncedFirstName, debouncedLastName]);

    const handleExport = () => {
        const params = new URLSearchParams();

        if(firstName)
        params.append("firstName", firstName);
        if(lastName)
        params.append("lastName", lastName);
        fetch(`api/employees/export?${params.toString()}`)
        .then((response) => response.blob())
        .then(blob => {
            const downloadUrl = window.URL.createObjectURL(blob);

            const a = document.createElement('a');

            a.href = downloadUrl;

            a.download = "employees.xml";

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
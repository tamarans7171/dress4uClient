import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
function Users() {
    const [users, setUsers] = useState()
    
    useEffect(() => {
        getUsers()
    }, [])


    async function getUsers() {
            await axios.get("https://dress4u.onrender.com/users/getUsers").then((resp) =>{
            let usersTemp = resp.data.map((user=>{
              return {...user, address: user.address.street + " " + user.address.numHouse + " " + user.address.city}
            }))    
            setUsers(usersTemp)
                console.log(usersTemp);
            })
    }

    const columns = [
      {
        width: 200,
        label: 'שם פרטי',
        dataKey: 'firstName',
        numeric: true,
      },
      {
        width: 120,
        label: 'שם משפחה',
        dataKey: 'lastName',
        numeric: true,
      },
      {
        width: 120,
        label: 'טלפון',
        dataKey: 'phone',
        numeric: true,
      },
      {
        width: 120,
        label: 'כתובת',
        dataKey: 'address',
        numeric: true,
      },
      {
        width: 190,
        label: 'מייל',
        dataKey: 'email',
        numeric: true,
      },
   
    ];
    
    const rows = users
    
    const VirtuosoTableComponents = {
      Scroller: React.forwardRef((props, ref) => (
        <TableContainer component={Paper} {...props} ref={ref} />
      )),
      Table: (props) => (
        <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
      ),
      TableHead,
      TableRow: ({ item: _item, ...props }) => <TableRow hover {...props} />,
      TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
    };
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
      [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
      },
      [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
      },
    }));
    
    function fixedHeaderContent() {
      return (
        <TableRow hover>
          {columns.map((column) => (
            <StyledTableCell
              key={column.dataKey}
              variant="head"
              align={column.numeric || false ? 'right' : 'left'}
              style={{ width: column.width }}
              sx={{
                backgroundColor: 'background.paper',
              }}
            >
              {column.label}
            </StyledTableCell>
          ))}
        </TableRow>
      );
    }
    
    function rowContent(_index, row) {
      return (
        <React.Fragment>
          {columns.map((column) => (
            <TableCell
              key={column.dataKey}
              align={column.numeric || false ? 'right' : 'left'}
            >
              {row[column.dataKey]}
            </TableCell>
          ))}
        </React.Fragment>
      );
    }
    
  return (
    
    <Paper style={{ height: 630, width: '70%',margin:"0 auto", padding: "80px 0 0 0"  }}>
    <TableVirtuoso
      data={rows}
      components={VirtuosoTableComponents}
      fixedHeaderContent={fixedHeaderContent}
      itemContent={rowContent}
    />
  </Paper>  )
}

export default Users
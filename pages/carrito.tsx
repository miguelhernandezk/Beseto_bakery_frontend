import {
  Container,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HeroHeader from '../components/HeroHeader';
import imgPastel from '../public/assets/imgs/Home/card2.jpg';
import Layout from '../components/Layout';

function Carrito() {
  function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number
  ) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];
  return (
    <>
      <Layout>
        <HeroHeader />
        <Container className="pt-16">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className="bg-beseto-bisque">
                <TableRow>
                  <TableCell />
                  <TableCell />
                  <TableCell align="left">Product</TableCell>
                  <TableCell align="left">Price</TableCell>
                  <TableCell align="left">Quantity</TableCell>
                  <TableCell align="left">Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <IconButton>
                        <CloseIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="right">
                      <img src={imgPastel.src} className="w-8" alt={row.name} />
                    </TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.carbs}</TableCell>
                    <TableCell align="left">{row.protein}</TableCell>
                    <TableCell align="left">
                      {(row.carbs * row.protein).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Layout>
    </>
  );
}

export default Carrito;

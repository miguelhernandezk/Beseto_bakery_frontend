import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { getAllProducts } from '../../services/products';
import { Product } from '../../interfaces/Product';
import { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';
import Toolbar from '../../components/Toolbar';
import Head from 'next/head';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';

export default function Products() {
  const [products, setProducts] = useState<Product[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [rows, setRows] = useState<GridRowsProp>();
  const [columns, setColumns] = useState<GridColDef[]>();
  const onSetProducts = async () => {
    const productsResponse = await getAllProducts();
    if (productsResponse.error) {
      setLoading(false);
      return undefined;
    } else {
      setLoading(false);
      const newProducts: Product[] = productsResponse.data;
      const newRows = newProducts.map((product, index) => ({
        id: index,
        name: product.name,
        persons: product.persons,
        variant: product.variant,
        price: product.price,
        category: product.category.name,
        actions: 'No sé',
      }));
      const newColumns = [
        { field: 'name', headerName: 'Nombre', width: 150 },
        { field: 'persons', headerName: 'Personas', width: 150 },
        { field: 'variant', headerName: 'Presentación', width: 150 },
        { field: 'price', headerName: 'Precio', width: 150 },
        { field: 'category', headerName: 'Categoría', width: 150 },
        {
          field: 'actions',
          headerName: 'perro',
          width: 150,
          renderCell: (params) => {
            return <Button variant="contained">Click</Button>;
          },
        },
      ];
      setRows(newRows);
      setColumns(newColumns);
      setProducts(newProducts.reverse());
    }
  };

  //   const rows: GridRowsProp = [
  //     { id: 1, col1: 'Hello', col2: 'World' },
  //     { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
  //     { id: 3, col1: 'MUI', col2: 'is Amazing' },
  //   ];

  //   const columns: GridColDef[] = [
  //     { field: 'col1', headerName: 'Column 1', width: 150 },
  //     { field: 'col2', headerName: 'Column 2', width: 150 },
  //   ];

  useEffect(() => {
    onSetProducts();
  }, []);
  return (
    <>
      <Head>
        <title>Productos - Beseto</title>
        <meta property="og:title" content="Todos los productos Beseto" />
        <meta
          name="description"
          content="Encuentra todos los productos de los que disponemos"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:url"
          content={`https://www.beseto.com.mx/products/`}
        />
        <meta
          property="og:image"
          content="https://portfoliomiguelhernandezk.s3.us-west-1.amazonaws.com/Beseto/Productos/Tres+Leches/gelatinaFrutosRojosQueso.jpeg"
        />
      </Head>
      <Toolbar />
      <Container className="py-4">
        {rows && columns && (
          <div style={{ height: 300, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} />
          </div>
        )}
        {loading === false ? (
          <Grid
            container
            spacing={{ xs: 2, md: 4 }}
            columns={{ xs: 4, md: 12 }}
          >
            {products !== undefined && products !== null
              ? products.map((product) => (
                  <Grid key={product._id} item xs={4}>
                    <ProductCard
                      _id={product._id}
                      image={product.picture[0]}
                      name={product.name}
                      description={product.description}
                      price={product.price}
                    />
                  </Grid>
                ))
              : null}
          </Grid>
        ) : (
          <Stack justifyContent="center" alignItems="center">
            <CircularProgress />
            <Typography>Cargando productos</Typography>
          </Stack>
        )}
      </Container>
    </>
  );
}

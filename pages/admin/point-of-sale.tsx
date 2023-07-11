import { Button, CircularProgress, Container, Typography } from '@mui/material';
import { getAllProducts } from '../../services/products';
import { Product } from '../../interfaces/Product';
import { useContext, useEffect, useState } from 'react';
import Toolbar from '../../components/Toolbar';
import Head from 'next/head';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbar,
} from '@mui/x-data-grid';
import AppContext from '../../context/AppContext';
import { useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { Role } from '../../interfaces/Enums';
import { authOptions } from '../api/auth/[...nextauth]';

export default function PointOfSale() {
  const { data: session, status } = useSession();
  const { cart, addToCart } = useContext(AppContext);
  const [rows, setRows] = useState<GridRowsProp>();
  const [columns, setColumns] = useState<GridColDef[]>();
  const [uiState, setUiState] = useState<'loading' | 'info loaded'>();

  const addOneToCart = async (productId: string) => {
    if (status === 'authenticated' && session) {
      addToCart(session.access_token, productId, 1);
    }
  };

  const onSetProducts = async () => {
    const productsResponse = await getAllProducts();
    if (productsResponse.error) {
      return undefined;
    } else {
      const newProducts: Product[] = productsResponse.data;
      const newRows: GridRowsProp = newProducts.map((product) => ({
        id: product._id,
        name: product.name,
        persons: product.persons,
        variant: product.picture[0],
        price: product.price,
        category: product.category.name,
        actions: 'No sé',
      }));
      const newColumns: GridColDef[] = [
        { field: 'name', headerName: 'Nombre', width: 300 },
        { field: 'persons', headerName: 'Personas', width: 70 },
        {
          field: 'variant',
          headerName: 'Presentación',
          width: 150,
          renderCell: (params) => {
            return params.row.variant ? (
              <img src={params.row.variant} />
            ) : (
              'No hay imagen'
            );
          },
        },
        { field: 'price', headerName: 'Precio', width: 80 },
        { field: 'category', headerName: 'Categoría', width: 150 },
        {
          field: 'actions',
          headerName: 'Carrito',
          width: 250,
          renderCell: (params) => {
            return (
              <Button
                className="bg-beseto-dark-gray text-white"
                variant="contained"
                onClick={() => addOneToCart(params.row.id)}
              >
                Agregar al carrito
              </Button>
            );
          },
        },
      ];
      setUiState('info loaded');
      setRows(newRows);
      setColumns(newColumns);
    }
  };
  useEffect(() => {
    if (status === 'authenticated') {
      onSetProducts();
    }
  }, [status, cart]);

  if (status === 'loading') return null;
  if (status === 'unauthenticated' || !session)
    return <Typography>Inicia sesión</Typography>;

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
        {uiState === 'info loaded' && (
          <>
            <Typography variant="h2" component="h1">
              Punto de venta
            </Typography>
            {rows && columns && (
              <div style={{ height: 300, width: '100%' }}>
                <DataGrid
                  autoHeight
                  rows={rows}
                  columns={columns}
                  rowHeight={60}
                  disableColumnFilter
                  disableColumnSelector
                  disableDensitySelector
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 100 },
                    },
                  }}
                />
              </div>
            )}
          </>
        )}
        {uiState === 'loading' && <CircularProgress />}
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<object> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session && session.user.role === Role.CUSTOMER) {
    return {
      notFound: true,
    };
  }
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};

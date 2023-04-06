import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { FormEvent, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ProductDto } from '../../interfaces/dtos/Product.dto';
import { createProduct } from '../../services/products';
import Head from 'next/head';
import { Category } from '../../interfaces/Category';
import { getAllCategories } from '../../services/categories';
import Footer from '../../components/Footer';
import { signinRedirect } from '../../services/auth';

type CakeFill = 'single' | 'double' | 'N/A';

export default function AdminSite() {
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [cakeFill, setCakeFill] = useState<CakeFill>('N/A');
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>('');

  const notifySuccess = (msg = 'Tarea realizada con éxito') =>
    toast.success(msg);

  const notifyError = (msg = 'Algo salió mal') => toast.error(msg);

  const handleChangeFill = (event: SelectChangeEvent) => {
    setCakeFill(event.target.value as CakeFill);
  };

  const handleChangeCategory = (event: SelectChangeEvent) => {
    setCurrentCategory(event.target.value);
  };

  const onSetCategories = async () => {
    const categoriesResponse = await getAllCategories();
    if (categoriesResponse.error) {
      notifyError('No pudimos recuperar las categorías');
    } else {
      const categories: Category[] = categoriesResponse.data;
      setAllCategories(categories);
      setCurrentCategory(categories[0]._id);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingState(true);
    const data = new FormData(event.currentTarget);
    const name = data.get('cakeName')?.toString();
    const flavor1 = data.get('flavor1')?.toString();
    const flavor2 = data.get('flavor2')?.toString();
    const persons = data.get('persons')?.toString();
    const variant = data.get('variant')?.toString();
    const picture = data.get('picture')?.toString();
    const description = data.get('description')?.toString();
    const price = data.get('price')?.toString();
    const tags = data.get('tags')?.toString();

    if (
      name !== undefined &&
      flavor1 !== undefined &&
      flavor2 !== undefined &&
      persons !== undefined &&
      variant !== undefined &&
      picture !== undefined &&
      description !== undefined &&
      price !== undefined &&
      tags !== undefined
    ) {
      const payload: ProductDto = {
        name: name,
        flavor1: flavor1,
        flavor2: flavor2,
        fill: cakeFill,
        persons: Number(persons),
        variant: Number(variant),
        picture: [picture],
        description: description,
        price: Number(price),
        tags: tags.split(',').map((tag) => tag.trim()),
        category: currentCategory,
      };
      const createProductResponse = await createProduct(payload);
      if (createProductResponse.error) {
        notifyError();
      } else {
        notifySuccess();
      }
      setLoadingState(false);
    } else {
      notifyError('Algunos de los valores no fueron ingresados correctamente');
      setLoadingState(false);
    }
  };

  useEffect(() => {
    onSetCategories();
  }, []);

  useEffect(() => {
    signinRedirect();
  }, []);

  return (
    <>
      <Head>
        <title>Añadir producto - Beseto</title>
      </Head>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
      />
      <>
        <Container className="w-full flex flex-col items-center justify-center text-center home">
          <Box className={`flex flex-col items-center`}>
            <Typography variant="h4">Agregar pastel</Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  margin="normal"
                  helperText="Nombre que se mostará a los clientes, por ejemplo: Pastel de Zarzamora con queso"
                  required
                  id="cakeName"
                  label="Nombre del pastel"
                  name="cakeName"
                  autoComplete="Nombre del pastel"
                  autoFocus
                  disabled={loadingState}
                />
                <TextField
                  margin="normal"
                  helperText="Sabor principal del pastel, por ejemplo: Zarzamora"
                  required
                  name="flavor1"
                  label="Sabor 1"
                  id="flavor1"
                  autoComplete="Sabor 1"
                  disabled={loadingState}
                />
                <TextField
                  margin="normal"
                  helperText="Sabor secundario del pasetel, por ejemplo: Queso"
                  name="flavor2"
                  label="Sabor 2"
                  id="flavor2"
                  autoComplete="Sabor 2"
                  disabled={loadingState}
                />
                <FormControl>
                  <InputLabel id="fill-label">Relleno</InputLabel>
                  <Select
                    labelId="fill-label"
                    id="fill"
                    value={cakeFill}
                    label="Relleno"
                    onChange={handleChangeFill}
                  >
                    <MenuItem value="single">Un relleno</MenuItem>
                    <MenuItem value="double">Doble relleno</MenuItem>
                    <MenuItem value="N/A">N/A</MenuItem>
                  </Select>
                  <FormHelperText>
                    Cantidad de rellenos. Si el pastel no aplica para relleno,
                    selecciona N/A
                  </FormHelperText>
                </FormControl>
                <TextField
                  margin="normal"
                  helperText="Tamaño del pastel, medido en cantidad de personas. Por ejemplo: 50 personas, 100 personas, etc"
                  required
                  name="persons"
                  label="cantidad de personas"
                  id="personss"
                  autoComplete="cantidad de personas"
                  disabled={loadingState}
                />
                <TextField
                  margin="normal"
                  helperText="Para pasteles del mismo sabor, pero que la decoración es diferente. "
                  required
                  name="variant"
                  label="Variante"
                  id="variant"
                  autoComplete="Variante"
                  disabled={loadingState}
                />
                <TextField
                  margin="normal"
                  helperText="URL de la imagen."
                  required
                  name="picture"
                  label="Url de la imagen"
                  id="picture"
                  autoComplete="Url de la imagen"
                  disabled={loadingState}
                />
                <TextField
                  margin="normal"
                  helperText="Descripción que verán los clientes en las tarjetas de presentación. Sé corto, claro y conciso."
                  required
                  name="description"
                  label="Descripción"
                  id="description"
                  autoComplete="Descripción"
                  disabled={loadingState}
                />
                <TextField
                  margin="normal"
                  helperText="Precio actual del pastel."
                  required
                  name="price"
                  label="Precio"
                  id="price"
                  autoComplete="Precio"
                  disabled={loadingState}
                />
                <TextField
                  margin="normal"
                  helperText="Palabras relacionadas al pastel. Por ejemplo: tres leches, zarzamora, queso, familiar, personalizado, queso philadelphia, etc"
                  required
                  name="tags"
                  label="Etiquetas"
                  id="tags"
                  autoComplete="Etiquetas"
                  disabled={loadingState}
                />
                {allCategories !== null &&
                allCategories !== undefined &&
                allCategories.length > 0 ? (
                  <FormControl>
                    <InputLabel id="category-label">Categoría</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category"
                      value={currentCategory}
                      label="Categoría"
                      onChange={handleChangeCategory}
                    >
                      {allCategories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      Categoría a la que pertenece este pastel
                    </FormHelperText>
                  </FormControl>
                ) : null}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loadingState}
                  className="bg-beseto-bisque"
                >
                  Crear
                </Button>
              </Stack>
            </Box>
          </Box>
        </Container>
      </>
      <Footer />
    </>
  );
}

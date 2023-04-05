import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import { FormEvent, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ProductDto } from '../../interfaces/dtos/Product.dto';
import { createProduct } from '../../services/products';

type CakeFill = 'single' | 'double' | 'N/A';

export default function AdminSite() {
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [cakeFill, setCakeFill] = useState<CakeFill>('N/A');

  const notifySuccess = (msg = 'Tarea realizada con éxito') =>
    toast.success(msg);

  const notifyError = (msg = 'Algo salió mal') => toast.error(msg);

  const handleChange = (event: SelectChangeEvent) => {
    setCakeFill(event.target.value as CakeFill);
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
    const category = data.get('category')?.toString();
    if (
      name !== undefined &&
      flavor1 !== undefined &&
      flavor2 !== undefined &&
      persons !== undefined &&
      variant !== undefined &&
      picture !== undefined &&
      description !== undefined &&
      price !== undefined &&
      tags !== undefined &&
      category !== undefined
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
        tags: [tags],
        category: category,
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
  return (
    <Container className="w-full flex flex-col items-center justify-center text-center home">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
      />
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="cakeName"
          label="Nombre del pastel"
          name="cakeName"
          autoComplete="Nombre del pastel"
          autoFocus
          disabled={loadingState}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="flavor1"
          label="Sabor 1"
          id="flavor1"
          autoComplete="Sabor 1"
          disabled={loadingState}
        />
        <TextField
          margin="normal"
          required
          fullWidth
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
            onChange={handleChange}
          >
            <MenuItem value="single">Un relleno</MenuItem>
            <MenuItem value="double">Doble relleno</MenuItem>
            <MenuItem value="N/A">N/A</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="normal"
          required
          fullWidth
          name="persons"
          label="cantidad de personas"
          id="personss"
          autoComplete="cantidad de personas"
          disabled={loadingState}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="variant"
          label="Variante"
          id="variant"
          autoComplete="Variante"
          disabled={loadingState}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="picture"
          label="Url de la imagen"
          id="picture"
          autoComplete="Url de la imagen"
          disabled={loadingState}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="description"
          label="Descripción"
          id="description"
          autoComplete="Descripción"
          disabled={loadingState}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="price"
          label="Precio"
          id="price"
          autoComplete="Precio"
          disabled={loadingState}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="tags"
          label="Etiquetas"
          id="tags"
          autoComplete="Etiquetas"
          disabled={loadingState}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="category"
          label="Categoría"
          id="category"
          autoComplete="Categoría"
          disabled={loadingState}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loadingState}
        >
          Create
        </Button>
      </Box>
    </Container>
  );
}

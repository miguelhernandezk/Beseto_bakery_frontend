import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Stack,
} from '@mui/material';

function Product({ image, name, description, price }) {
  return (
    <Card className="w-full">
      <CardActionArea>
        <CardMedia
          component="img"
          className="w-full"
          image={image}
          alt={name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Stack className="flex flex-row md:flex-col lg:flex-row justify-between items-center w-full">
          <Typography>{price}</Typography>
          <Button variant="contained" size="small" className="bg-beseto-bisque">
            Agregar al carrito
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
}

export default Product;

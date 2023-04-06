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

interface ProductProps {
  image: string;
  name: string;
  description: string;
  price: string | number;
}

function ProductCard({ image, name, description, price }: ProductProps) {
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

export default ProductCard;

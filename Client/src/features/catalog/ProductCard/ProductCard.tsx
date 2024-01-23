import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { Product } from "../../../app/modules/interfaces/Product";
import ProductCardHeader from "./ProductCardHeader";
import { Link } from "react-router-dom";

export interface IProductCard {
    product: Product
}

const ProductCard: React.FC<IProductCard> = (props) => {
    return (
        <Card>
            <ProductCardHeader name={props.product.name}/>
            <CardMedia
                sx={{ height: 140, backgroundSize: "contain", bgcolor: 'primary.light'}}
                image={props.product.pictureUrl}
                title={props.product.name}
            />
            <CardContent>
                <Typography gutterBottom color='secondary' variant="h5">
                    ${(props.product.price / 100).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {props.product.brand} / {props.product.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Add To Cart</Button>
                <Button component={Link} to={`/products/${props.product.id}`} size="small"  >View</Button>
            </CardActions>
        </Card>
    );
}

export default ProductCard;
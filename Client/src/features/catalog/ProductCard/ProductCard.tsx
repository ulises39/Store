import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { Product } from "../../../app/modules/interfaces/Product";
import ProductCardHeader from "./ProductCardHeader";
import { Link } from "react-router-dom";
import { useState } from "react";
import agent from "../../../app/api/Agent";
import { LoadingButton } from "@mui/lab";
import { useStoreContext } from "../../../app/context/StoreContext";
import { formatCurrency } from "../../../app/util/util";

export interface IProductCard {
    product: Product
}

const ProductCard: React.FC<IProductCard> = (props) => {
    const [loading, setLoading] = useState(false);
    const { setBasket } = useStoreContext();

    function handleAddItem(productId: number) {
        setLoading(true);
        agent.Basket.addItem(productId)
        .then(basket => setBasket(basket))
        .catch(error => console.log(error))
        .finally(() => setLoading(false));
    }

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
                    {formatCurrency(props.product.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {props.product.brand} / {props.product.description}
                </Typography>
            </CardContent>
            <CardActions>
                <LoadingButton 
                    loading={loading} 
                    onClick={() => handleAddItem(props.product.id)} 
                    size="small">
                        Add To Cart
                </LoadingButton>
                <Button component={Link} to={`/products/${props.product.id}`} size="small"  >View</Button>
            </CardActions>
        </Card>
    );
}

export default ProductCard;
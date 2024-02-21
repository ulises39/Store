import { LoadingButton } from "@mui/lab";
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Product } from "../../../app/modules/interfaces/Product";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import { formatCurrency } from "../../../app/util/util";
import { addBasketItemAsync } from "../../basket/BasketSlice";
import { BASKET_STATES } from "../../basket/BasketStates";
import ProductCardHeader from "./ProductCardHeader";

export interface IProductCard {
    product: Product
}

const ProductCard: React.FC<IProductCard> = (props) => {
    const { status } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();
    
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
                    loading={status.includes(`${BASKET_STATES.Pending}-${props.product.id}`)} 
                    onClick={() => dispatch(addBasketItemAsync({productId:  props.product.id}))} 
                    size="small">
                        Add To Cart
                </LoadingButton>
                <Button component={Link} to={`/products/${props.product.id}`} size="small"  >View</Button>
            </CardActions>
        </Card>
    );
}

export default ProductCard;
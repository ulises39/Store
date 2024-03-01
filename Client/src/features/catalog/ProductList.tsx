import { Grid } from "@mui/material";
import { Product } from "../../app/modules/interfaces/Product";
import ProductCard from "./ProductCard/ProductCard";
import { useAppSelector } from "../../app/store/configureStore";
import ProductCardSkeleton from "./ProductCardSkeleton";

export interface IProductListProps {
    products: Product[],
}

const ProductList: React.FC<IProductListProps> = (props) => {

    const { productsLoaded } = useAppSelector(state => state.catalog);

    return (
        <Grid container spacing={4}>
            {props.products.map((product) => (
                <Grid item xs={4} key={product.id}>
                    { productsLoaded 
                        ? <ProductCard product={product}/>
                        : <ProductCardSkeleton/>
                    }
                    
                </Grid>
            ))}
        </Grid>
    );
};

export default ProductList;
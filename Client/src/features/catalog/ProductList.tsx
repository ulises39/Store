import { Grid } from "@mui/material";
import { Product } from "../../app/modules/interfaces/Product";
import ProductCard from "./ProductCard/ProductCard";

export interface IProductListProps {
    products: Product[],
}

const ProductList: React.FC<IProductListProps> = (props) => {
    return (
        <Grid container spacing={4}>
            {props.products.map((product) => (
                <Grid item xs={3} key={product.id}>
                    <ProductCard product={product}/>
                </Grid>
            ))}
        </Grid>
    );
};

export default ProductList;
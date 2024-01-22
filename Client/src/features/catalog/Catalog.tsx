import { useState, useEffect } from "react";
import { Product } from "../../app/modules/interfaces/Product";
import ProductList from "./ProductList";

const Catalog: React.FC = () => {

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/products")
        .then(response => response.json())
        .then(data => setProducts(data))
    }, []);


    return (
        <>
            <ProductList products={products}/>
        </>
    );
}

export default Catalog;
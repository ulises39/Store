import { useEffect, useState } from "react";
import agent from "../../app/api/Agent";
import { Product } from "../../app/modules/interfaces/Product";
import ProductList from "./ProductList";
import Loading from "../../app/layout/Loading";

const Catalog: React.FC = () => {

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        agent.Catalog.list()
        .then((products: Product[])  => setProducts(products))
        .catch(error => console.log(error))
        .finally(() => setLoading(false));
    }, []);

    if(loading) return <Loading message="Loading products catalog..."/>

    return (
        <>
            <ProductList products={products}/>
        </>
    );
}

export default Catalog;
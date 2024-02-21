import { useEffect } from "react";
import Loading from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchAllProductsAsync, productsSelectors } from "./CatalogSlice";
import { CATALOG_STATES } from "./CatalogStates";
import ProductList from "./ProductList";

const Catalog: React.FC = () => {

    const products = useAppSelector(productsSelectors.selectAll);
    const dispatch = useAppDispatch();
    const { productsLoaded, status } = useAppSelector(state => state.catalog);

    useEffect(() => {
        if(!productsLoaded) dispatch(fetchAllProductsAsync());
    }, [dispatch, productsLoaded]);

    if(status === CATALOG_STATES.PendingFetchProducts) return <Loading message="Loading products catalog..."/>

    return (
        <>
            <ProductList products={products}/>
        </>
    );
}

export default Catalog;
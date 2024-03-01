import { FormControl, Grid, Paper } from "@mui/material";
import { useEffect } from "react";
import AppPagination from "../../app/components/AppPagination";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import Loading from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchAllProductsAsync, fetchFilters, productsSelectors, setPageNumber, setProductParams } from "./CatalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";

const sortOptions = [
    { value: 'name', label: 'Alphabetical' },
    { value: 'priceDesc', label: 'Price - High to Low' },
    { value: 'price', label: 'Price - Low to High' },
];

const Catalog: React.FC = () => {
    const products = useAppSelector(productsSelectors.selectAll);
    const dispatch = useAppDispatch();
    const { productsLoaded, filtersLoaded, brands, types, productParams, metaData } = useAppSelector(state => state.catalog);

    useEffect(() => {
        if(!productsLoaded) dispatch(fetchAllProductsAsync());
    }, [dispatch, productsLoaded]);

    useEffect(() => {
        if(!filtersLoaded) dispatch(fetchFilters());
    }, [dispatch, filtersLoaded]);

    const handleRadioButtonGroupChange = (event: any) => {
        dispatch(setProductParams({ orderBy: event.target.value }));
    }

    const handleBrandsCheckButtonsChange = (items: string[]) => {
        dispatch(setProductParams({ brands: items }));
    }

    const handleTypesCheckButtonsChange = (items: string[]) => {
        dispatch(setProductParams({ types: items }));
    }

    const handleAppPaginationChange = (page: number) => {
        dispatch(setPageNumber({ pageNumber: page }));
    }

    if(!filtersLoaded) return <Loading message="Loading products catalog..."/>

    return (
        <Grid container columnSpacing={4} >
            <Grid item xs={3}>
                <Paper sx={{ mb: 2}}>
                    <ProductSearch/>
                </Paper>
                <Paper sx={{ mb: 2, p: 2 }}>
                    <FormControl component="fieldset">
                        <RadioButtonGroup
                            selectedValue={ productParams.orderBy }
                            options={sortOptions} 
                            onChange={ handleRadioButtonGroupChange }/>
                    </FormControl>
                </Paper>
                <Paper sx={{ mb: 2, p: 2 }}>
                    <CheckboxButtons
                        items={brands}
                        checked={productParams.brands ?? []}
                        onChange={ handleBrandsCheckButtonsChange }
                    />
                </Paper>
                <Paper sx={{ mb: 2, p: 2 }}>
                <CheckboxButtons
                        items={types}
                        checked={productParams.types ?? []}
                        onChange={ handleTypesCheckButtonsChange }
                    />
                </Paper>
            </Grid>
            <Grid item xs={9}>
                <ProductList products={products}/>
            </Grid>
            <Grid item xs={3}/>
            <Grid item xs={9} sx={{ mt: 2, mb: 2 }}>
                { metaData && <AppPagination
                    metaData={metaData}
                    onPageChange={handleAppPaginationChange}
                />}
            </Grid>
        </Grid>
    );
}

export default Catalog;
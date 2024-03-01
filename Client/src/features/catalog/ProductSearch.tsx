import { TextField, debounce } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./CatalogSlice";
import { useState } from "react";

const ProductSearch: React.FC = () => {
    const { productParams } = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchTerm(event.target.value);
        debouncedSearch(event);
    };

    const debouncedSearch = debounce((event: any) => {
        dispatch(setProductParams({ searchTerm: event.target.value }));
    }, 1000);

    return (
        <TextField 
            label='Search products'
            variant='outlined'
            fullWidth
            value={searchTerm || ''}
            onChange={ handleOnChange }
            />
    );
}

export default ProductSearch;
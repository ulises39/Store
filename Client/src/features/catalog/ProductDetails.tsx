import { LoadingButton } from '@mui/lab';
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import agent from '../../app/api/Agent';
import NotFound from '../../app/errors/NotFound';
import Loading from '../../app/layout/Loading';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { formatCurrency } from '../../app/util/util';
import { addBasketItemAsync, removeBasketItemAsync } from '../basket/BasketSlice';
import { BASKET_STATES } from '../basket/BasketStates';
import { fetchSingleProductAsync, productsSelectors } from './CatalogSlice';
import { CATALOG_STATES } from './CatalogStates';

const ProductDetails: React.FC = () => {
    const { basket, status } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();
    const { id } = useParams<{ id: string }>();
    const product = useAppSelector(state => productsSelectors.selectById(state, parseInt(id!)));
    const { status: productStatus } = useAppSelector(state => state.catalog);
    const [quantity, setQuantity] = useState(0);
    const item = basket?.items.find(i => i.productId === product?.id);

    useEffect(() => {
        if (item) setQuantity(item.quantity);
        if(!product && id) dispatch(fetchSingleProductAsync(parseInt(id)));
    }, [dispatch, id, item, product]);

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const quantity = parseInt(event.currentTarget.value);
        if(quantity >= 0) setQuantity(quantity);
    }

    const handleUpdateCart = async () => {
        try {
            if(!product) return 
            if(!item || quantity > item.quantity ) {
                const updatedQuantity = item ? quantity - item.quantity : quantity;
                dispatch(addBasketItemAsync({ productId: product.id, quantity: updatedQuantity } ));
            }else{
                const updatedQuantity = item.quantity - quantity;
                await agent.Basket.removeItem(product.id, updatedQuantity);
                dispatch(removeBasketItemAsync({
                    productId: product.id,
                    quantity: updatedQuantity
                }));
            }
        } catch (error) {
            console.log(error);            
        }
    }    

    if (productStatus === CATALOG_STATES.PendingFetchSingleProduct) return <Loading message='Loading product...'/>

    if (!product) return <NotFound/>

    return (
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={product.name} style={{ width: '100%' }} />
            </Grid>
            <Grid item xs={6}>
                <Typography variant='h3'>{product.name}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant='h4' color='secondary'>{formatCurrency(product.price)}</Typography>
                <TableContainer>
                    <Table>
                        <TableBody sx={{ fontSize: '1.1em' }}>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity in stock</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            variant='outlined'
                            type='number'
                            label='Quantity in Cart'
                            fullWidth
                            value={quantity}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <LoadingButton 
                            disabled={item?.quantity === quantity || !item && quantity === 0}
                            loading={ status.includes(BASKET_STATES.Pending) }
                            onClick={handleUpdateCart}
                            sx={{height: '55px'}} 
                            color='primary' 
                            size='large' 
                            variant='contained' 
                            fullWidth
                        >
                            {item ? 'Update Quantity' : 'Add to Cart'}
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default ProductDetails;
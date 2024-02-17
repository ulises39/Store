import { LoadingButton } from '@mui/lab';
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import agent from '../../app/api/Agent';
import { useStoreContext } from '../../app/context/StoreContext';
import NotFound from '../../app/errors/NotFound';
import Loading from '../../app/layout/Loading';
import { Product } from '../../app/modules/interfaces/Product';
import { formatCurrency } from '../../app/util/util';

const ProductDetails: React.FC = () => {
    const { basket, setBasket, removeItem } = useStoreContext();
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const item = basket?.items.find(i => i.productId === product?.id);

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const quantity = parseInt(event.currentTarget.value);
        if(quantity >= 0) setQuantity(quantity);
    }

    const handleUpdateCart = async () => {
        try {
            if(!product) return 
            setSubmitting(true);
            if(!item || quantity > item.quantity ) {
                const updatedQuantity = item ? quantity - item.quantity : quantity;                
                const updatedBasket = await agent.Basket.addItem(product.id, updatedQuantity);
                setBasket(updatedBasket);
            }else{
                const updatedQuantity = item.quantity - quantity;
                await agent.Basket.removeItem(product.id, updatedQuantity);
                removeItem(product.id, updatedQuantity);
            }
            setSubmitting(false);
        } catch (error) {
            console.log(error);            
        }
    }

    useEffect(() => {

        if (item) setQuantity(item.quantity);

        id && agent.Catalog.details(parseInt(id))
            .then(response => setProduct(response))
            .catch(error => console.log(error))
            .finally(() => setLoading(false))
    }, [id, item]);

    if (loading) return <Loading message='Loading product...'/>

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
                            loading={submitting} 
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
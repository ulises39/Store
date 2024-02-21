import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { formatCurrency } from "../../app/util/util";
import { addBasketItemAsync, removeBasketItemAsync } from "./BasketSlice";
import { BASKET_STATES } from "./BasketStates";
import BasketSummary from "./BasketSummary";

const BasketPage: React.FC = () => {
    const { basket, status } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

    if (!basket) return <Typography variant="h3">Your basket is empty</Typography>

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right">Subtotal</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {basket.items.map((basketItem) => (
                            <TableRow
                                key={basketItem.productId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">                                
                                    <Box display='flex' alignItems='center'>
                                        <img src={basketItem.pictureUrl} alt={basketItem.name} style={{ height: 50, marginRight: 20}} />
                                        <span>{basketItem.name}</span>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">{formatCurrency(basketItem.price)}</TableCell>
                                <TableCell align="center">
                                    <LoadingButton 
                                            loading={status === `${BASKET_STATES.PendingRemoveItem}-${basketItem.productId}Rem` }
                                            onClick={() => dispatch(removeBasketItemAsync({ productId: basketItem.productId, quantity: 1, name: 'Rem' }))}
                                            color="secondary">
                                        <Remove/>
                                    </LoadingButton>
                                    {basketItem.quantity}
                                    <LoadingButton 
                                            loading={status === `${BASKET_STATES.PendingAddItem}-${basketItem.productId}`}
                                            onClick={() => dispatch(addBasketItemAsync({ productId: basketItem.productId }))} 
                                            color="secondary">
                                        <Add/>
                                    </LoadingButton>
                                </TableCell>
                                <TableCell align="right"> {formatCurrency(basketItem.price * basketItem.quantity)} </TableCell>
                                <TableCell align="right">
                                    <LoadingButton 
                                            loading={status === `${BASKET_STATES.PendingRemoveItem}-${basketItem.productId}Del`}
                                            onClick={() => dispatch(removeBasketItemAsync({ productId: basketItem.productId, quantity: basketItem.quantity, name: 'Del' }))}
                                            color="error">
                                        <Delete/>
                                    </LoadingButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container>
                <Grid item xs={6}/>
                <Grid item xs={6}>
                    <BasketSummary/>
                    <Button 
                        component={Link}
                        to="/checkout"
                        variant="contained"
                        size='large'
                        fullWidth
                    >
                        Checkout
                    </Button>
                </Grid>
            </Grid>
        </>
    );
}

export default BasketPage;
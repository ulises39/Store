import { Button, ButtonGroup, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { decrement, increment } from "./CounterSlice";

const ContactPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { count: data, title } = useAppSelector(state => state.counter);

    return(
        <>
            <Typography variant="h2">
                Contact Page
            </Typography>
            <Typography variant="h3">
                { title }
            </Typography>
            <Typography variant="h5">
                The data is {data}
            </Typography>
            <ButtonGroup>
                <Button onClick={() => dispatch(decrement(1))} variant="contained" color="error">Decrement</Button>
                <Button onClick={() => dispatch(increment(1))} variant="contained" color="info">Increment</Button>
                <Button onClick={() => dispatch(increment(5))} variant="contained" color="secondary">Increment by 5</Button>
            </ButtonGroup>
        </>
    );
}

export default ContactPage;
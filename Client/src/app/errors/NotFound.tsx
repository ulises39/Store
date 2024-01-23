import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound: React.FC = () =>{
    return (
        <Container component={Paper} sx={{height: 400}}>
            <Typography gutterBottom variant='h3' sx={{marginTop: "2rem"} }>Oops - We could not find what you're looking for</Typography>
            <Divider/>
            <Button fullWidth component={Link} to='/catalog'>Go back to shop</Button>
        </Container>
    );
}

export default NotFound;
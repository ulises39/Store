import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

export interface ILoadingProps {
    message?: string;
}

const Loading: React.FC<ILoadingProps> = (props) => {
    return (
        <Backdrop open={true} invisible={true}>
            <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
                <CircularProgress size={100} color='secondary'/>
                <Typography variant='h4' sx={{ justifyContent: 'center', position: 'fixed', top: '60%' }}>
                    {props.message ?? 'Loading...'}
                </Typography>
            </Box>
        </Backdrop>
    );
}

export default Loading;
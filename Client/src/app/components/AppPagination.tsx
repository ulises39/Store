import { Box, Typography, Pagination } from "@mui/material";
import { MetaData } from "../modules/interfaces/Pagination";

export interface IAppPaginationProps {
    metaData: MetaData;
    onPageChange: (page: number) => void;
}

const AppPagination: React.FC<IAppPaginationProps> = (props) => {
    
    const { currentPage, totalCount, totalPages, pageSize } = props.metaData;

    const currentPageDisplay = () => {
        return (currentPage - 1) * pageSize + 1;
    }

    const lastPageDisplay = () => {
        return currentPage * pageSize > totalCount ? totalCount : currentPage * pageSize;
    }

    const handleOnChange = (event: React.ChangeEvent<unknown>, page: number) => {
        props.onPageChange(page);
    }
    
    return (
        <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography>
                {`Displaying ${currentPageDisplay()}-${lastPageDisplay()} of ${totalCount} items`}
            </Typography>
            <Pagination
                color='secondary'
                size='large'
                count={totalPages}
                page={currentPage}
                onChange={ handleOnChange }
            />
        </Box>
    );
}

export default AppPagination;
import { Avatar, CardHeader } from "@mui/material";

export interface IProductCardHeaderProps {
    name: string
}

const ProductCardHeader: React.FC<IProductCardHeaderProps> = (props) => {
    return (
        <CardHeader
                avatar ={
                    <Avatar sx={ { bgcolor: 'secondary.main' } }>
                        {props.name.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title = {
                    props.name
                }
                titleTypographyProps={ 
                    {
                        sx: { fontWeight: 'bold', color: 'primary.main' }
                    }
                }
        />
    );
}

export default ProductCardHeader;
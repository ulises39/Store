import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

const midLinks = [
    { title: 'products', path: '/products' },
    { title: 'about', path: '/about' },
    { title: 'contact', path: '/contact' },
];

const rightLinks = [
    { title: 'login', path: '/login' },
    { title: 'register', path: '/register' },
];

const navStyles = { 
    color: 'inherit',
    textDecoration: 'none',
    typography: 'h6',
    '&:hover': {
        color: "grey.500"
    },
    '&.active': {
        color: "secondary.main"
    }
}

export interface IHeaderProps {
    darkMode: boolean;
    handleSwitchChange: () => void;
}

const Header: React.FC<IHeaderProps> = (props) => {
    return (
        <AppBar position="static" sx={ { mb: 4 } }>
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Box display='flex' alignItems='center'>
                    <Typography 
                        variant="h6" 
                        component={NavLink} 
                        to="/"
                        sx={navStyles}>
                        ReStore
                    </Typography>
                    <Switch checked={props.darkMode} onClick={props.handleSwitchChange} sx={ {color: 'black'} }/>
                </Box>
                
                
                <List sx={{display: 'flex'}}>
                    {midLinks.map(({title, path}) => (
                        <ListItem
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={navStyles}>   
                            {title.toUpperCase()}
                        </ListItem>
                    ))}
                    <ListItem 
                        component={NavLink}
                        to="errors"
                        key='test-errors'
                        sx={navStyles}>
                            {("Test Errors").toUpperCase()}
                    </ListItem>
                </List>

                <Box display='flex' alignItems='center'>
                    <IconButton size="large" color="inherit">
                            <Badge badgeContent='4' color="secondary">
                                <ShoppingCart/>
                            </Badge>
                    </IconButton>
                    <List sx={{display: 'flex'}}>
                        {rightLinks.map(({title, path}) => (
                            <ListItem
                                component={NavLink}
                                to={path}
                                key={path}
                                sx={ navStyles }
                            >   
                                {title.toUpperCase()}
                            </ListItem>
                        ))}
                    </List>
                </Box>
                

            </Toolbar>
        </AppBar>
    );
}

export default Header;
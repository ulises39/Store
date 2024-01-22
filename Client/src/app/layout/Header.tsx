import { AppBar, Switch, Toolbar, Typography } from "@mui/material";

export interface IHeaderProps {
    darkMode: boolean;
    handleSwitchChange: () => void;
}

const Header: React.FC<IHeaderProps> = (props) => {
    return (
        <AppBar position="static" sx={ { mb: 4 } }>
            <Toolbar>
                <Typography variant="h6">
                    ReStore
                </Typography>
                <Switch checked={props.darkMode} onClick={props.handleSwitchChange} sx={ {color: 'black'} }/>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
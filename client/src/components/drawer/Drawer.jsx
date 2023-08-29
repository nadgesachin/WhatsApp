import { styled, Drawer, Box, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useTheme, useMediaQuery } from '@mui/material';

//components
import Profile from './Profile';

const Header = styled(Box)`
  background: #008069;
  height: 107px;
  color: #FFFFFF;
  display: flex;
  & > svg, & > p {
    margin-top: auto;
    padding: 15px;
    font-weight: 600;
`;

const Component = styled(Box)`
  background: #ededed;
  height: 85%;
`;

const Text = styled(Typography)`
    font-size: 18px;
`

const drawerStyle = {
    left: 20,
    top: 17,
    height: '95%',
    width: '30%',
    boxShadow: 'none'
}

const InfoDrawer = ({ open, setOpen, profile }) => {
    const theme = useTheme();
    const isMedium = useMediaQuery(theme.breakpoints.up('md')); // for medium and up
    const isSmall = useMediaQuery(theme.breakpoints.down('sm')); // for small and down

    const drawerWidth = isMedium ? '50%' : isSmall ? '91%' : '50%'; 

    const updatedDrawerStyle = {
        ...drawerStyle,
        width: drawerWidth
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Drawer
            open={open}
            onClose={handleClose}
            PaperProps={{ sx: updatedDrawerStyle }}
            style={{ zIndex: 1500 }}
        >
            <Header>
                <ArrowBack onClick={() => setOpen(false)} />
                <Text>Profile</Text>
            </Header>
            <Component>
                {profile && <Profile />}
            </Component>
        </Drawer>
    );
}

export default InfoDrawer;
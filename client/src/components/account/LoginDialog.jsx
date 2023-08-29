import { useContext } from 'react';
import { useTheme } from '@mui/material/styles';

import { Dialog, Typography, List, ListItem, Box, styled } from '@mui/material';

import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";

import { addUser } from '../../service/api';
import { AccountContext } from '../../context/AccountProvider';
import { qrCodeImage } from '../../constants/data';



const Component = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('md')]: { 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    [theme.breakpoints.down('sm')]: { 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        
    }
}));

const Title = styled(Typography)(({ theme }) => ({
    fontSize: 26,
    color: '#525252',
    marginBottom: 25,
    fontFamily: 'Segoe UI,Helvetica Neue,Helvetica,Lucida Grande,Arial,Ubuntu,Cantarell,Fira Sans,sans-serif',
    fontWeight: 300,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    [theme.breakpoints.down('md')]: {
        fontSize: 22,
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: 18,
    }
}));

const LeftContainer = styled(Box)(({ theme }) => ({
    flex: 1, 
    padding: theme.spacing(7),
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(3),
        order: 1,
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
        order: 1,
    }
}));

const RightContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
        order: 2,
    },
    [theme.breakpoints.down('sm')]: {
        order: 2,
    }
}));


const Container = styled(Box)(({ theme }) => ({
    padding: theme.spacing(7, 0, 7, 7),
    flex: 1,
    overflowY: 'auto',
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(3),
    }
}));


const QRCOde = styled('img')({
    margin: '50px 0 0 50px',
    height: 264,
    width: 264
});


const StyledList = styled(List)`
    &  > li {
        padding: 0;
        margin-top: 15px;
        font-size: 18px;
        line-height: 28px;
        
        color: #3a3a3a;
    }
    [theme.breakpoints.down('md')]: {
        order: 3,
    },
    [theme.breakpoints.down('sm')]: {
        order: 3,
    }
`;


const dialogStyle = ( theme ) => ({
    marginTop: '12%',
    height: '95%',
    width: '60%',
    maxWidth: '100',
    maxHeight: '100%',
    borderRadius: 0,
    boxShadow: 'none',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: { // For small screens and below
        width: '95%', // Take up almost full width on mobile
        marginTop: '5%', // Reduce top margin
    }
});


const LoginDialog = () => {
    const theme = useTheme();
    const { setAccount,showloginButton, setShowloginButton, setShowlogoutButton } = useContext(AccountContext);

    const onLoginSuccess = async (res) => {
        let decoded = jwt_decode(res.credential);
        setAccount(decoded);
        setShowloginButton(false);
        setShowlogoutButton(true);
        await addUser(decoded);
    };

    const onLoginFailure = (res) => {
        console.log('Login Failed:', res);
    };

   
    return (
        <Dialog
            open={true}
            BackdropProps={{style: {backgroundColor: 'unset'}}}
            maxWidth={'md'}
            PaperProps={{ sx: dialogStyle }}
        >
            <Component>
                {/* Left Side - Title and List */}
                <LeftContainer>
                    <Title>To use WhatsApp on your computer:</Title>
                    <StyledList>
                        <ListItem>1. Open WhatsApp on your phone</ListItem>
                        <ListItem>2. Tap Menu Settings and select WhatsApp Web</ListItem>
                        <ListItem>3. Point your phone to this screen to capture the code</ListItem>
                    </StyledList>
                </LeftContainer>
    
                {/* Right Side - QR Code */}
                <RightContainer>
                    <Box style={{position:'relative'}}>
                        <QRCOde src={qrCodeImage} alt="QR Code" />
                        <Box style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)'}}>
                            { showloginButton ?
                                <GoogleLogin
                                    buttonText=""
                                    onSuccess={onLoginSuccess}
                                    onError={onLoginFailure}
                                /> : null}
                        </Box>
                    </Box>
                </RightContainer>
            </Component>
        </Dialog>
    );
    
}

export default LoginDialog;
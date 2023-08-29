import { useContext } from 'react';
import { Dialog, styled, Box } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';

import { UserContext } from '../../context/UserProvider';

//components
import Menu from './menu/Menu';
import ChatBox from './chat/ChatBox';
import EmptyChat from './chat/EmptyChat';


const Component = styled(Box)`
    display: flex;
`;
//     min-width: 450px;
// `;
    
// const RightComponent = styled(Box)`
//     width: 73%;
//     min-width: 300px;
//     height: 100%;
//     border-left: 1px solid rgba(0, 0, 0, 0.14);
// `;

// const dialogStyle = {
//     height: '95%',
//     width: '100%',
//     margin: '20px',
//     maxWidth: '100%',
//     maxHeight: '100%',
//     borderRadius: 0,
//     boxShadow: 'none',
//     overflow: 'hidden'
// };

const LeftComponent = styled(Box)(({ isMobile, isMedium }) => ({
    minWidth: isMobile ? '100%' : (isMedium ? '50%' : '40%'),
    marginBottom: isMobile ? '16px' : '0',
}));

const RightComponent = styled(Box)(({ isMobile, isMedium }) => ({
    width: isMobile ? '100%' : (isMedium ? '50%' : '73%'),
    minWidth: isMobile ? '100%' : '300px',
    height: '100%',
    borderLeft: isMobile ? 'none' : '1px solid rgba(0, 0, 0, 0.14)',
}));


const dialogStyle = (isMobile) => ({
    height: '95%',
    width: isMobile ? '90%' : '100%',
    margin: '20px',
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: 0,
    boxShadow: 'none',
    overflow: 'hidden'
});


const ChatDialog = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isMedium = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const { person } = useContext(UserContext);

    return (
        <Dialog 
            open={true} 
            BackdropProps={{style: {backgroundColor: 'unset'}}}
            PaperProps={{ sx: dialogStyle(isMobile) }}
            maxWidth={'md'}
        >
            <Component>
                <LeftComponent isMobile={isMobile} isMedium={isMedium}>
                    <Menu/>
                </LeftComponent>
                { !isMobile && 
                <RightComponent isMobile={isMobile} isMedium={isMedium}>
                    {
                        Object.keys(person).length  ? <ChatBox/> : <EmptyChat />
                    }
                </RightComponent>}
            </Component>
            {isMobile && 
                (Object.keys(person).length  ? <ChatBox/> : <EmptyChat />)
            }
        </Dialog>
    )  
}

export default ChatDialog;
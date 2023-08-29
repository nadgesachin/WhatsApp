import { useContext, useEffect } from 'react';
import { Box, styled, Typography } from '@mui/material';
import { Check } from '@mui/icons-material';
import { GetApp as GetAppIcon } from '@mui/icons-material';

import { AccountContext } from '../../../context/AccountProvider';
import { useInView } from 'react-intersection-observer';
import { updateMessageStatus } from '../../../service/api';
import { downloadMedia, formatDate } from '../../../utils/common-utils';
import { iconPDF } from '../../../constants/data';

//     background: #FFFFFF;
//     padding: 5px;
//     max-width: 60%;
//     width: fit-content;
//     display: flex;
//     border-radius: 10px;
//     word-break: break-word;
// `;

// const Own = styled(Box)`
//     background: #dcf8c6;
//     padding: 5px;
//     max-width: 60%;
//     width: fit-content;
//     margin-left: auto;
//     display: flex;
//     border-radius: 10px;
//     word-break: break-word;
// `;

// Messages Container
const MessagesContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    justifyContent: flex-end;
`;

const Wrapper = styled(Box)`
    background: #FFFFFF;
    padding: 5px;
    max-width: 90%;
    width: fit-content;
    display: flex;
    border-radius: 10px;
    word-break: break-word;
    align-self: flex-start;
    margin: 2px;
`;

const Own = styled(Box)`
    background: #dcf8c6;
    padding: 5px;
    max-width: 90%;
    width: fit-content;
    display: flex;
    border-radius: 10px;
    word-break: break-word;
    align-self: flex-end;
    margin: 2px;
`;


const Text = styled(Typography)`
    font-size: 14px;
    padding: 0 25px 0 5px;
`;

const Time = styled(Typography)`
    font-size: 10px;
    color: #919191;
    word-break: keep-all;
    margin-top: auto;
`;


const Message = ({ message }) => {
    const { account } = useContext(AccountContext);

    const isSent = account.sub === message.senderId;

    return (
        <>
            {isSent ? 
                <Own>
                    {message.type === 'file' ? <ImageMessage message={message} isSent={isSent} /> : <TextMessage message={message} isSent={isSent} />}
                </Own>
            : 
                <Wrapper>
                    {message.type === 'file' ? <ImageMessage message={message} isSent={false} /> : <TextMessage message={message} isSent={false} />}
                </Wrapper>
            }
        </>
    )
}


const TextMessage = ({ message, isSent }) => {
    const { ref, inView } = useInView({ threshold: 0.5 });

    useEffect(() => {
        if (inView && message.status !== "seen") {
            updateMessageStatus(message._id, 'seen');  
        }
    }, [inView]);

    return (
        <div ref={ref} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>{message.text}</Text>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '-20px' }}>
        <Time>{formatDate(message.createdAt)}</Time>
            {isSent && message.status === 'seen' ? (
                <Check color="primary" fontSize="small" style={{ marginLeft: '5px' }} />
            ) : isSent ? (
                <Check color="action" fontSize="small" style={{ marginLeft: '5px' }} />
            ) : null}
        </div>
    </div>

    );
}


const ImageMessage = ({ message,isSent }) => {
    return (
        <div style={{ position: 'relative' }}>
            {message?.text?.includes('.pdf') ?
                <div style={{ display: 'flex' }}>
                    <img src={iconPDF} alt="pdf-icon" style={{ width: 80 }} />
                    <Typography style={{ fontSize: 14 }}>{message.text.split("/").pop()}</Typography>
                </div>
            : 
                <img style={{ width: 300, height: '100%', objectFit: 'cover' }} src={message.text} alt={message.text} />
            }
            <div style={{ position: 'absolute', bottom: 0, right: 0, display: 'flex', alignItems: 'center' }}>
            <GetAppIcon onClick={(e) => downloadMedia(e, message.text)} fontSize='small' style={{ marginRight: 10, border: '1px solid grey', borderRadius: '50%' }} />
            <Time>{formatDate(message.createdAt)}</Time>
            {isSent && message.status === 'seen' ? (
                <Check color="primary" fontSize="small" />
            ) : isSent ? (
                <Check color="action" fontSize="small" />
            ) : null}
        </div>

        </div>
    )
}

export { MessagesContainer };

export default Message;

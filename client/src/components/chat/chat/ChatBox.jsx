

import { useContext, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { UserContext } from '../../../context/UserProvider';
import { AccountContext } from '../../../context/AccountProvider';
import { getConversation } from '../../../service/api';
import ChatHeader from './ChatHeader';
import Messages from './Messages';
import { batchUpdateMessageStatus } from '../../../service/api';


const ChatBox = () => {
    const { person } = useContext(UserContext);
    const { account } = useContext(AccountContext);

    const [conversation, setConversation] = useState({});
    const [messages, setMessages] = useState([]); // Assuming this state will hold the chat messages
    
    useEffect(() => {
        const getConversationDetails = async () => {
            let data = await getConversation({ senderId: account.sub, receiverId: person.sub });
            setConversation(data);
        }
        getConversationDetails();
    }, [person.sub]);

    useEffect(() => {
        const markMessagesAsSeen = () => {
            const unreadMessageIds = messages.filter(msg => msg.status !== 'seen' && msg.receiverId === account.sub).map(msg => msg._id);
            if (unreadMessageIds.length > 0) {
                batchUpdateMessageStatus(unreadMessageIds);  
            }
        };
        window.addEventListener('focus', markMessagesAsSeen);
        return () => {
            window.removeEventListener('focus', markMessagesAsSeen);
        };
    }, [messages, account]);

    return (
        <Box style={{height: '75%'}}>
            <ChatHeader person={person} />
            <Messages person={person} conversation={conversation} />
        </Box>
    );
}

export default ChatBox;

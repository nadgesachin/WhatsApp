

import { useState, useEffect, useContext, useRef } from 'react';
import { Box, styled } from '@mui/material';
import { batchUpdateMessageStatus } from '../../../service/api';
import { io } from 'socket.io-client';

import { getMessages, newMessages } from '../../../service/api';
import { AccountContext } from '../../../context/AccountProvider';

//components
import Message, { MessagesContainer } from './Message';
import Footer from './Footer';

const Wrapper = styled(Box)`
    background-image: url(${'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'});
    background-size: 50%;
`;

const StyledFooter = styled(Box)`
    height: 55px;
    background: #ededed;
    // position: absolute;
    width: 100%;
    // bottom: 0
`;
    
const Component = styled(Box)`
    height: 80vh;
    overflow-y: scroll;
`;

const Container = styled(Box)`
   
`;



const Messages = ({ person, conversation }) => {

    const [messages, setMessages] = useState([]);
    const [incomingMessage, setIncomingMessage] = useState(null);
    const [value, setValue] = useState();
    const [file, setFile] = useState();
    const [image, setImage] = useState();

    const scrollRef = useRef();

    const { account, socket, newMessageFlag, setNewMessageFlag } = useContext(AccountContext);

    useEffect(() => {
        socket.current.on('getMessage', data => {
            setIncomingMessage({
                ...data,
                createdAt: Date.now()
            })
        })
    }, []);
    
    useEffect(() => {
        const getMessageDetails = async () => {
            let data = await getMessages(conversation?._id);
            setMessages(data);
        }
        getMessageDetails();
    }, [conversation?._id, person._id, newMessageFlag]);

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
    
    
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ transition: "smooth" })
    }, [messages]);

    useEffect(() => {
        incomingMessage && conversation?.members?.includes(incomingMessage.senderId) && 
            setMessages((prev) => [...prev, incomingMessage]);
        
    }, [incomingMessage, conversation]);

    const receiverId = conversation?.members?.find(member => member !== account.sub);

    const sendText = async (input) => {
        let isEnterKeyPress = false;
    
        if (typeof input === "object" && input.preventDefault) {
            let code = input.keyCode || input.which;
            if (code !== 13) return;
            isEnterKeyPress = true;
            input.preventDefault(); // it's an event, so prevent the default behavior
        }
    
        if (!value) return;
    
        if (isEnterKeyPress || !isEnterKeyPress) { 
            // This condition might seem redundant but can be useful if you need separate logic in the future
            let message = {};
            if (!file) {
                message = {
                    senderId: account.sub,
                    receiverId: receiverId,
                    conversationId: conversation._id,
                    type: 'text',
                    text: value
                };
            } else {
                message = {
                    senderId: account.sub,
                    conversationId: conversation._id,
                    receiverId: receiverId,
                    type: 'file',
                    text: image
                };
            }
    
            socket.current.emit('sendMessage', message);
    
            await newMessages(message);
    
            setValue('');
            setFile();
            setImage('');
            setNewMessageFlag(prev => !prev);
        } 
    }

    return (
        <Wrapper>
            <Component>
                <Container>
                    <MessagesContainer>
                        {
                            messages && messages.map(message => (
                                <Message message={message} />
                            ))
                        }
                        <div ref={scrollRef}></div> {/* This empty div is the target for the scroll reference */}
                    </MessagesContainer>
                </Container>
            </Component>
            <Footer 
                sendText={sendText} 
                value={value} 
                setValue={setValue} 
                setFile={setFile} 
                file={file} 
                setImage={setImage}
            />
        </Wrapper>
    )
}

export default Messages;
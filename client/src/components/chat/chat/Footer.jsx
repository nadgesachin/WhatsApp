import { useEffect,useState } from 'react';
import { EmojiEmotions, AttachFile, Mic,Send } from '@mui/icons-material';
import { Box, styled, InputBase,Button } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';
import { uploadFile } from '../../../service/api';
import AttachmentPicker from './AttachmentPicker';

const Container = styled(Box)`
    height: 55px;
    background: #ededed;
    width: 96.7%;
    display: flex;
    position:relative;
    align-items: center;
    padding: 0 15px;
    &  > * {
        margin: 1px;
        color: #919191;
    }
`;

const Search = styled(Box)`
    border-radius: 18px;
    background-color: #FFFFFF;
    width: calc(94% - 100px);
`;

const InputField = styled(InputBase)`
    width: 100%;
    padding: 20px;
    padding-left: 25px;
    font-size: 14px;
    height: 20px;
`;

const ClipIcon = styled(AttachFile)`
    transform: 'rotate(40deg)'
`;
const SendButton = styled(Send)`
    color: #128C7E; // The classic WhatsApp color
    font-size: 24px; 
    cursor: pointer;
    margin-left:3px;
    color: #FFFFFF;
`;
const SendMic = styled(Box)`
    padding: 8px;
    border-radius: 50%;
    margin-left:3px;
    background-color: rgb(0 136 108);
`;



const PickerWrapper = styled(Box)` 
    position: absolute; 
    bottom: 70px; 
    
    width: 30%;
    z-index: 1000;
`;
const SmallEmojiPicker = styled(EmojiPicker)`
    transform: scale(0.75); 
    transform-origin: bottom;
`;

const Footer = ({ sendText, value, setValue, setFile, file, setImage }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showAttachmentPicker, setShowAttachmentPicker] = useState(false);

    const toggleEmojiPicker = () => {
        setShowAttachmentPicker(false);  // Hide AttachmentPicker when EmojiPicker is shown
        setShowEmojiPicker(prevState => !prevState);
    }

    const toggleAttachmentPicker = () => {
        setShowEmojiPicker(false); // Hide EmojiPicker when AttachmentPicker is shown
        setShowAttachmentPicker(prevState => !prevState);
    }

    useEffect(() => {
        const getImage = async () => {
            if (file) {
                const data = new FormData();
                data.append("name", file.name);
                data.append("file", file);

                const response = await uploadFile(data);
                setImage(response.data);
            }
        }
        getImage();
    }, [file])

    const onFileChange = (e) => {
        setValue(e.target.files[0].name);
        setFile(e.target.files[0]);
    }

    const handleEmojiClick = (emojiObject) => {
        console.log(emojiObject);
        setValue(prevValue => prevValue + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const inputType = e.target.id; // This can be 'imageInput', 'documentInput', etc.
    
        console.log(`Selected ${inputType}:`, selectedFile);
        // Handle file processing logic here
    };
    
    
    return (
        <Container>
             <EmojiEmotions style={{ color: 'gray'}} onClick={toggleEmojiPicker} />

            <PickerWrapper>
                {showEmojiPicker && 
                    <SmallEmojiPicker 
                        
                        onEmojiClick={handleEmojiClick} 
                        pickerStyle={{ position: 'absolute', bottom: '100%', left: '0', width: '100%',transform: 'scale(0.75)'  }}
                    />
                } 

                {showAttachmentPicker && <AttachmentPicker onFileChange={handleFileChange} />}
            </PickerWrapper>

            <Button onClick={toggleAttachmentPicker}>
                <ClipIcon style={{ color: 'black'}}/>
            </Button>

            <Search>
                <InputField
                    placeholder="Type a message"
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            sendText(e);
                        }
                    }}
                    
                    value={value}
                />
            </Search>
            <SendMic>
            {value ? <SendButton onClick={() => {
            console.log("Send Button Clicked");
            sendText(value);
            }} /> : <Mic />}
            </SendMic> 
            
        </Container>
    )
}

export default Footer;
import { Camera, InsertDriveFile, Audiotrack, Person, PhotoCamera } from '@mui/icons-material';
import { Box, styled, IconButton } from '@mui/material';

const PickerContainer = styled(Box)`
    background: #f7f7f7;
    padding: 5px;
    border-radius: 12px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15);
    display: grid;
    grid-template-columns: repeat(3, 1fr); // 3 icons in a row
    gap: 10px;
    position: absolute; 
    bottom: 5px;  
`;

const FileInput = styled('input')`
    display: none;
`;

const StyledIconButton = styled(IconButton)`
    background: #fff;
    border-radius: 12px;
    transition: all 0.3s;

    &:hover {
        background: #f1f1f1;
    }
`;


const AttachmentPicker = ({ onFileChange }) => {
    return (
        <PickerContainer>
            <label htmlFor="imageInput">
                <StyledIconButton component="span">
                    <PhotoCamera fontSize="small" />
                </StyledIconButton>
            </label>
            <FileInput
                type='file'
                id="imageInput"
                accept="image/*"
                onChange={onFileChange}
            />

            <label htmlFor="documentInput">
                <StyledIconButton component="span">
                    <InsertDriveFile fontSize="small" />
                </StyledIconButton>
            </label>
            <FileInput
                type='file'
                id="documentInput"
                accept=".pdf,.doc,.docx"
                onChange={onFileChange}
            />

            <label htmlFor="audioInput">
                <StyledIconButton component="span">
                    <Audiotrack fontSize="small" />
                </StyledIconButton>
            </label>
            <FileInput
                type='file'
                id="audioInput"
                accept="audio/*"
                onChange={onFileChange}
            />

            <StyledIconButton>
                <Camera fontSize="small" />
            </StyledIconButton>

            <StyledIconButton>
                <Person fontSize="small" />
            </StyledIconButton>
        </PickerContainer>
    );
}


export default AttachmentPicker;

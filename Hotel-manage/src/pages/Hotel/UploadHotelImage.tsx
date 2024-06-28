import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  CloseCircleIcon,
  CloseIcon,
  PencilEditIcon,
  SaveIcon,
} from "src/assets/iconify";
import ImageConverter from "src/common/ImageConverter";
import Scrollbar from "src/components/Scrollbar";
import showMessage from "src/util/ShowMessage";

type Props = {
  onClose: () => void;
  onSaveImages: (imageList: any[]) => void;
};

export default function UploadHotelImage({ onClose, onSaveImages }: Props) {
  const [saveImage, setSaveImage] = useState<any[]>([]);
  const theme = useTheme();
  useEffect(() => {
    return () => saveImage.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => onDrop(acceptedFiles),
  });

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      setSaveImage([
        {
          bufferFile: acceptedFiles.map(
            async (file: any) => await ImageConverter.fileToBuffer(file)
          ),
          preview: acceptedFiles.map((file: any) => URL.createObjectURL(file)),
        },
        ...saveImage,
      ]);
    },
    [saveImage]
  );

  const removeImage = (preview: string) => {
    const filterImageList = saveImage.filter(
      (objImg) => objImg.preview !== preview
    );
    setSaveImage(filterImageList);
  };

  const onSave = () => {
    if (saveImage.length !== 0) {
      onSaveImages(saveImage);
      onClose();
    } else {
      showMessage("Select Image to Save", theme, () => {});
    }
  };

  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle>Hotel Images</DialogTitle>
      <Divider orientation="horizontal" flexItem sx={{ mt: 2 }} />
      <DialogContent
        sx={{
          height: 300,
          maxHeight: 300,
        }}
      >
        <Scrollbar sx={{ height: "100%" }}>
          <RootStyle>
            <DropZone {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              <Text>
                Drag 'n' drop some Images here, or click to select Image.
              </Text>
            </DropZone>

            <ImageListWrapper>
              {saveImage.map((img) => (
                <Fragment key={img}>
                  <ImageWrapper>
                    <InnerThumb>
                      <Image
                        src={img.preview}
                        // onLoad={() => {
                        //   URL.revokeObjectURL(img);
                        // }}
                      />
                    </InnerThumb>
                    {/* <EditBtnWrapper>
                      <PencilEditIcon
                        height={"100%"}
                        width={"100%"}
                        IconColor={theme.palette.info.main}
                      />
                    </EditBtnWrapper> */}
                    <CancleBtnWrapper onClick={() => removeImage(img.preview)}>
                      <CloseCircleIcon height={"100%"} width={"100%"} />
                    </CancleBtnWrapper>
                  </ImageWrapper>
                </Fragment>
              ))}
            </ImageListWrapper>
          </RootStyle>
        </Scrollbar>
      </DialogContent>
      <Divider orientation="horizontal" flexItem sx={{ mt: 2 }} />
      <DialogActions>
        <Button startIcon={<SaveIcon />} variant="outlined" onClick={onSave}>
          Save
        </Button>
        <Button startIcon={<CloseIcon />} onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const RootStyle = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
}));

const DropZone = styled(Box)(({ theme }) => ({
  height: 100,
  borderRadius: "10px",
  border: `1px dashed ${theme.palette.divider}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const Text = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.text.secondary,
}));

const ImageListWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  marginTop: 16,
  maxWidth: "100%",
  flexWrap: "wrap",
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  borderRadius: 2,
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
  position: "relative",
}));

const InnerThumb = styled(Box)(() => ({
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
}));

const Image = styled("img")(() => ({
  display: "block",
  width: 200,
  height: "100%",
  objectFit: "cover",
}));

const CancleBtnWrapper = styled(Box)(() => ({
  height: 20,
  width: 20,
  borderRadius: "50%",
  cursor: "pointer",
  position: "absolute",
  top: -4,
  right: -4,
  backgroundColor: "whitesmoke",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
const EditBtnWrapper = styled(Box)(() => ({
  height: 20,
  width: 20,
  borderRadius: "50%",
  cursor: "pointer",
  position: "absolute",
  top: -4,
  left: 0,
  backgroundColor: "whitesmoke",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.08rem",
}));

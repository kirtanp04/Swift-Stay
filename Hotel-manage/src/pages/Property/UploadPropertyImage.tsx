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
import { Fragment, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CloseCircleIcon, CloseIcon, SaveIcon } from "src/assets/iconify";
import Scrollbar from "src/components/Scrollbar";
import showMessage from "src/util/ShowMessage";

type Props = {
  onClose: () => void;
  onSaveImages: (imageList: string[]) => void;
  imageList: string[];
};

async function fileToBase64(File: any) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e: any) => resolve(e.target.result);
    reader.readAsDataURL(File);
  });
}

export default function UploadPropertyImage({
  onClose,
  onSaveImages,
  imageList,
}: Props) {
  const [saveImage, setSaveImage] = useState<string[]>(imageList);
  const theme = useTheme();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
    maxSize: 3 * 1024 * 1024, // 3MB,
    onDrop: <T extends File>(acceptedFiles: T[]) => onDrop(acceptedFiles),
    // onDropRejected: (fileRejections: FileRejection[]) =>
    //   onDropRejected(fileRejections),
  });

  // const onDropRejected = (fileRejections: FileRejection[]) => {
  //   fileRejections.forEach((file) => {
  //     file.errors.forEach((err: FileError) => {
  //       if (err.code === "file-too-large") {
  //         showMessage(err.message, theme, () => {});
  //       }
  //       if (err.code === "file-invalid-type") {
  //         showMessage(err.message, theme, () => {});
  //       }
  //     });
  //   });
  // };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(
        async (file: File) =>
          await fileToBase64(file).then((base64: any) =>
            setSaveImage([base64, ...saveImage])
          )
      );
    },
    [saveImage]
  );

  const removeImage = (preview: string) => {
    const filterImageList = saveImage.filter((objImg) => objImg !== preview);
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
      <DialogTitle>Property Images</DialogTitle>
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
                        src={img}
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
                    <CancleBtnWrapper onClick={() => removeImage(img)}>
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
// const EditBtnWrapper = styled(Box)(() => ({
//   height: 20,
//   width: 20,
//   borderRadius: "50%",
//   cursor: "pointer",
//   position: "absolute",
//   top: -4,
//   left: 0,
//   backgroundColor: "whitesmoke",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   padding: "0.08rem",
// }));

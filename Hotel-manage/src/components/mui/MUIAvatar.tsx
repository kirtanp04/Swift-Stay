import { Avatar, useTheme } from "@mui/material";
import { getAvatarColor, getFirstLetter } from "src/common/common";

type Props = {
  src?: string;
  name: string;
};

export default function MUIAvatar({ name, src }: Props) {
  const theme = useTheme();
  if (src !== undefined) {
    return <Avatar alt={name} src={src} />;
  }

  return (
    <Avatar
      alt={name}
      sx={{ bgcolor: getAvatarColor(name), color: theme.palette.text.primary }}
    >
      {getFirstLetter(name)}
    </Avatar>
  );
}

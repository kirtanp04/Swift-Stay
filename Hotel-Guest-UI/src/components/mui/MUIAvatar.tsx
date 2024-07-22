import { Avatar, AvatarProps, useTheme } from "@mui/material";
import { getAvatarColor, getFirstLetter } from "src/common/common";

interface Props extends AvatarProps {
  src?: string;
  name: string;
}

export default function MUIAvatar({ name, src, ...other }: Props) {
  const theme = useTheme();
  if (src !== undefined) {
    return <Avatar alt={name} src={src} {...other} />;
  }

  return (
    <Avatar
      alt={name}
      sx={{ bgcolor: getAvatarColor(name), color: theme.palette.text.primary }}
      {...other}
    >
      {getFirstLetter(name)}
    </Avatar>
  );
}

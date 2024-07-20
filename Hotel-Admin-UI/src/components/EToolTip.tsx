import { Tooltip, Zoom } from "@mui/material";

type Props = {
  title: string;
  children: any;
};

export default function EToolTip({ title, children }: Props) {
  return (
    <Tooltip title={title} TransitionComponent={Zoom} arrow>
      {children}
    </Tooltip>
  );
}

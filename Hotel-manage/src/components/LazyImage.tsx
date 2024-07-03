import { Skeleton, styled } from "@mui/material";
import React, { useState } from "react";
import LazyLoad from "react-lazyload";

interface TProps
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  src: string;
  alt: string;
}

function LazyImage({ src, alt, ...other }: TProps) {
  const [loading, setLoading] = useState(true);

  return (
    <LazyLoad width="100%" height="100%">
      {loading && <Skeleton variant="rectangular" width="100%" height="100%" />}
      <Image
        src={src}
        alt={alt}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
        style={{ display: loading ? "none" : "block" }}
        {...other}
      />
    </LazyLoad>
  );
}

export default LazyImage;

const Image = styled("img")(() => ({
  height: "100%",
  width: "100%",
  objectFit: "fill",
  borderRadius: "15px",
}));

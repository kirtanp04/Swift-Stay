import { Box, styled } from "@mui/material";
import { Helmet } from "react-helmet";
import { descriptionContent } from "../Constant";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import setFavicon from "./Favicon";

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function Page({ title, description, children }: Props) {
  const _description: string = description || descriptionContent;
  const { pathname } = useLocation();
  useEffect(() => {
    setFavicon();
  }, []);
  return (
    // <main>
    <RootStyle>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title} | Swift Stay</title>
        <link rel="canonical" href={pathname} />
        <meta name="description" content={_description} />
      </Helmet>

      {children}
    </RootStyle>
    // </main>
  );
}

const RootStyle = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  // height: "100%",
  // padding: "1rem",
}));

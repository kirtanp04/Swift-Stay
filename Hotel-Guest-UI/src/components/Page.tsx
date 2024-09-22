import { Box, styled } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { descriptionContent } from "../Constant";

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function Page({ title, description, children }: Props) {
  const _description: string = description || descriptionContent;
  const { pathname } = useLocation();

  // useEffect(() => {
  //   const originalTitle = title + " | Swift Stay"; // Original title
  //   const spacePadding = " ".repeat(30); // Space for smoother transition
  //   const longTitle = originalTitle + spacePadding; // Add space padding

  //   let scrollPosition = 0;
  //   const scrollSpeed = 100; // Speed in milliseconds
  //   const pauseTime = 20; // Pause before restarting scrolling
  //   const titleLength = longTitle.length;

  //   const scrollTitle = () => {
  //     if (scrollPosition < titleLength) {
  //       // Create the new title
  //       const newTitle = longTitle.substring(
  //         scrollPosition,
  //         scrollPosition + originalTitle.length
  //       );
  //       document.title = newTitle; // Update the document title

  //       scrollPosition += 1; // Increment position for smooth effect
  //     } else {
  //       // Pause for a brief moment after reaching the end
  //       document.title = ""; // Hide the title
  //       setTimeout(() => {
  //         scrollPosition = 0; // Reset scroll position
  //         document.title = originalTitle; // Restore the original title
  //       }, pauseTime);
  //     }
  //   };

  //   // Set an interval for smooth scrolling
  //   const intervalId = setInterval(scrollTitle, scrollSpeed);

  //   // Cleanup on component unmount
  //   return () => {
  //     clearInterval(intervalId);
  //     document.title = originalTitle; // Restore the original title
  //   };
  // }, [title]);
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

const RootStyle = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  "&::selection": {
    backgroungColor: theme.palette.text.primary,
    color: theme.palette.background.default,
  },
}));

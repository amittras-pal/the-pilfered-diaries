import headerImg from "../../resources/images/header.jpg";
import { BackgroundImage, Box, Button, Text } from "@mantine/core";
import React from "react";

const HeaderBlock: React.FC = () => {
  const scrollToStories = () => {
    document
      .getElementById("storiesList")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Box my={16}>
      <BackgroundImage
        src={headerImg}
        sx={(theme) => ({
          height: "300px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderRadius: theme.radius.lg,
        })}
        p="xl">
        <Text
          sx={(theme) => ({
            fontSize: "1.75rem",
            color: theme.colors.gray[0],
            lineHeight: 1,
          })}
          weight="bold">
          An Exploration For Stories
        </Text>
        <Text color="white" mt={8}>
          Stories can be found very easily. And I like to put those stories up
          into sketches of time. Come explore with me what I found on my journey
          to find interesting stories.
        </Text>
        <Button
          size="sm"
          mt={12}
          sx={(theme) => ({ marginRight: "auto" })}
          onClick={scrollToStories}>
          Explore All Stories
        </Button>
      </BackgroundImage>
    </Box>
  );
};

export default HeaderBlock;

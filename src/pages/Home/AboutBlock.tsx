import { BackgroundImage, Box, Text } from "@mantine/core";
import React from "react";
import { APP_TITLE } from "../../constants/appConstants";
import authorImg from "../../resources/images/Author.jpg";

const AboutBlock: React.FC = () => {
  return (
    <BackgroundImage src={authorImg} radius="lg">
      <Box
        p={16}
        sx={(theme) => ({
          backgroundColor: `${theme.black}00088`,
          borderRadius: theme.radius.lg,
          height: "100%",
        })}>
        <Text size="xl" weight="bold" mb={8}>
          About
        </Text>
        <Text mb={8} weight={500}>
          {APP_TITLE} is a collection of short stories. They were all collected
          from my own interactions with the people around me. The stories
          contained here may or may not be based on true events, but they
          contain some influence of the life I have lived so far.
        </Text>
        <Text mb={8} weight={500}>
          All that I've tried to do here is put those little events and
          experiences, and sometimes absolute fantasies into a coherent sequence
          of events that may appeal to readers of pseudo non-fiction.
        </Text>
        <Text align="right" weight="bold">
          - Amittras Pal
        </Text>
      </Box>
    </BackgroundImage>
  );
};

export default AboutBlock;

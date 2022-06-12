import { ActionIcon, Box, Group, Tooltip } from "@mantine/core";
import React from "react";
import { BrandInstagram, MailFast } from "tabler-icons-react";

const Footer: React.FC = () => {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.black,
        padding: theme.spacing.md,
      })}>
      <Group my={16} spacing={4}>
        <Tooltip withArrow position="top" placement="start" label="Instagram">
          <ActionIcon
            size="lg"
            color="orange"
            variant="hover"
            component="a"
            href="https://www.instagram.com/the.pilfered.diaries"
            target="_blank">
            <BrandInstagram />
          </ActionIcon>
        </Tooltip>
        <Tooltip withArrow position="top" placement="start" label="Send Email">
          <ActionIcon
            size="lg"
            color="orange"
            variant="hover"
            component="a"
            href="mailto:soham.pal.777@gmail.com"
            target="_blank">
            <MailFast />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Box>
  );
};

export default Footer;

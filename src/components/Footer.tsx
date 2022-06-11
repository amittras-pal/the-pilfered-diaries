import { ActionIcon, Box, Group, Text, Tooltip } from "@mantine/core";
import React from "react";
import { BrandInstagram, MailFast } from "tabler-icons-react";
import { APP_TITLE } from "../constants/appConstants";

const Footer: React.FC = () => {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: `${theme.colors.gray[1]}77`,
        margin: "0 -10px",
        padding: theme.spacing.md,
      })}>
      <Text
        size="xl"
        color="dimmed"
        weight="bold"
        sx={(theme) => ({ fontSize: "2rem" })}>
        {APP_TITLE.toUpperCase()}
      </Text>
      <Group my={16}>
        <Tooltip withArrow position="top" placement="start" label="Instagram">
          <ActionIcon size="lg" color="orange" variant="filled">
            <BrandInstagram />
          </ActionIcon>
        </Tooltip>
        <Tooltip withArrow position="top" placement="start" label="Send Email">
          <ActionIcon size="lg" color="orange" variant="filled">
            <MailFast />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Box>
  );
};

export default Footer;

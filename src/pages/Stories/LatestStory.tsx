import { Box, Button, Group, Image, Text } from "@mantine/core";
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "tabler-icons-react";
import cover from "../../resources/images/book1.png";

const LatestStory: React.FC = () => {
  return (
    <Box
      p={12}
      pt={6}
      sx={(theme) => ({
        backgroundColor: theme.colors.gray[9],
        borderRadius: theme.radius.lg,
      })}>
      <Text color="dimmed" weight="bold" size="xl" mb={8}>
        Latest Story
      </Text>
      <Group noWrap align="start">
        <Image
          src={cover}
          width="140px"
          height="100%"
          radius="md"
          sx={(theme) => ({
            boxShadow: theme.shadows.md,
            borderRadius: theme.radius.md,
            borderColor: theme.colors.blue[4],
            borderWidth: "1px",
            borderStyle: "solid",
          })}
        />
        <Group direction="column" spacing={6}>
          <Text weight="bold" size="sm">
            A High School Crush (The Pilfered Diaries #1)
          </Text>
          <Text size="sm" color="dimmed" lineClamp={4}>
            Does the restless compulsion to chase someone ever fully disappear
            from our lives? Or does it linger, like smouldering embers, waiting
            for that fresh gust of air to flare up into the blaze it was always
            supposed to be?
          </Text>
          <Button
            component={Link}
            to={`/story/1234`}
            color="orange"
            size="sm"
            rightIcon={<ArrowRight />}
            sx={(theme) => ({
              boxShadow: theme.shadows.md,
            })}>
            Explore
          </Button>
        </Group>
      </Group>
    </Box>
  );
};

export default LatestStory;

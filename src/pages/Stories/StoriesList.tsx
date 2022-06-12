import {
  Badge,
  Box,
  Group,
  Image,
  ScrollArea,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { Clock } from "tabler-icons-react";
import cover from "../../resources/images/book1.png";

function StoriesList() {
  return (
    <Box sx={{ width: "calc(100vw - 24px)" }}>
      <Text size="lg" color="gray" weight="bold" mb={12} id="storiesList">
        Recently Uploaded Stories
      </Text>
      <ScrollArea
        style={{
          height: "410px",
          width: "100%",
        }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            gap: "1rem",
            height: "100%",
          }}>
          <Box
            component={Link}
            to={"/story/2345"}
            sx={(theme) => ({
              height: "400px",
              width: "220px",
              overflow: "hidden",
              textDecoration: "none",
            })}>
            <Image
              src={cover}
              width="100%"
              radius="lg"
              sx={(theme) => ({
                boxShadow: theme.shadows.md,
                border: `1px solid ${theme.colors.gray[2]}`,
                borderRadius: theme.radius.lg,
              })}
            />
            <Text
              lineClamp={2}
              weight="bold"
              mt={6}
              px={4}
              sx={(theme) => ({
                color: theme.colors.gray[6],
              })}>
              A High School Crush (The Pilfered Diaries #1)
            </Text>
            <Badge color="green">Free</Badge>
          </Box>
          <Group
            direction="column"
            spacing={12}
            sx={(theme) => ({
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "87px",
              width: "220px",
              boxShadow: theme.shadows.md,
              border: `1px solid ${theme.colors.gray[8]}`,
              borderRadius: theme.radius.lg,
            })}>
            <ThemeIcon size={100} color="gray" variant="light" radius="lg">
              <Clock size={80} />
            </ThemeIcon>
            <Text weight="bold" color="dimmed" mb={30}>
              More Stories Coming Soon.
            </Text>
          </Group>
        </div>
      </ScrollArea>
    </Box>
  );
}

export default StoriesList;

import { Avatar, Box, SimpleGrid, Text } from "@mantine/core";
import React from "react";
import { useAuth } from "../../context/AuthContext";

const Profile: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <SimpleGrid
      breakpoints={[
        { minWidth: 755, cols: 2, spacing: "sm" },
        { minWidth: 600, cols: 1, spacing: "sm" },
      ]}>
      <Box
        p={16}
        mx={16}
        sx={(theme) => ({
          border: `1px solid ${theme.colors.gray[3]}`,
          borderRadius: theme.radius.md,
        })}>
        <Avatar size="xl" radius="md" src={currentUser?.photoURL} />
        <Text size="lg" weight="bold" mt={8}>
          {currentUser?.displayName}
        </Text>
        <Text color="dimmed">{currentUser?.email}</Text>
      </Box>
    </SimpleGrid>
  );
};

export default Profile;

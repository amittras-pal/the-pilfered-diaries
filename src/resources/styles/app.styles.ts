import { createStyles } from "@mantine/core";

export const useAppStyles = createStyles((theme) => ({
  app: {
    height: "100vh",
    width: "100vw",
  },
  navbar: {
    flexGrow: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.2s ease-in-out",
  },
  navbarScrolled: {
    boxShadow: theme.shadows.md,
  },
  appBody: {
    height: "calc(100vh - 60px)",
    width: "100vw",
  },
}));

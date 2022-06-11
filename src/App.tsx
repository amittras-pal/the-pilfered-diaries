import { Box, Group, Navbar, ScrollArea, Text } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { Link } from "react-router-dom";
import Login from "./components/Login";
import { APP_TITLE } from "./constants/appConstants";
import AuthContextProvider from "./context/AuthContext";
import { useAppStyles } from "./resources/styles/app.styles";
import RouterOutlet from "./routes/RouterOutlet";

function App() {
  const {
    classes: { app, navbar, navbarScrolled, appBody },
    cx,
  } = useAppStyles();

  const [scroll] = useWindowScroll();

  return (
    <AuthContextProvider>
      <Group direction="column" spacing={0} className={app}>
        <Navbar
          p="md"
          height={60}
          className={cx(navbar, { [navbarScrolled]: scroll.y > 100 })}>
          <Text size="lg" color="orange" weight="bold" component={Link} to="/">
            {APP_TITLE}
          </Text>
          <Login />
        </Navbar>
        <ScrollArea className={appBody}>
          <Box px={12}>
            <RouterOutlet />
          </Box>
        </ScrollArea>
      </Group>
    </AuthContextProvider>
  );
}

export default App;

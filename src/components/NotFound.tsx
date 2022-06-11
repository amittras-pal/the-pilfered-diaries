import { Center } from "@mantine/core";
import { Error404 } from "tabler-icons-react";

const NotFound = () => {
  return (
    <Center sx={(theme) => ({ width: "100vh" })}>
      <Error404 size={200} />
    </Center>
  );
};

export default NotFound;

import { SimpleGrid } from "@mantine/core";
import React from "react";
import LatestStory from "../Stories/LatestStory";
import StoriesList from "../Stories/StoriesList";
import AboutBlock from "./AboutBlock";
import Header from "./HeaderBlock";

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <SimpleGrid
        spacing={16}
        cols={2}
        my={16}
        breakpoints={[{ maxWidth: 768, cols: 1, spacing: 16 }]}>
        <LatestStory />
        <AboutBlock />
      </SimpleGrid>
      <StoriesList />
    </>
  );
};

export default Home;

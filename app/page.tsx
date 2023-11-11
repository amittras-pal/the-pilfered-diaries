import Header from "./components/home/Header";
import StoriesList from "./components/home/StoriesList";
import { CACHE_CFG } from "./constants";
import { SiteImageConfig, StoryDoc } from "./types/entities";
import { getBaseUrl } from "./utils";

export default async function Home() {
  const headerRes = await fetch(getBaseUrl("/api/site-config"), CACHE_CFG);
  const storiesRes = await fetch(getBaseUrl("/api/stories?limit=4"), CACHE_CFG);

  const headerData = (await headerRes.json()) as SiteImageConfig;
  const stories = (await storiesRes.json()) as StoryDoc[];

  return (
    <>
      <Header data={headerData} />
      <div className="mt-2 md:mt-3 p-2 md:p-4 flex flex-col md:flex-row gap-2 md:gap-3">
        <section className="basis-3/5">
          <StoriesList data={stories} />
        </section>
      </div>
    </>
  );
}

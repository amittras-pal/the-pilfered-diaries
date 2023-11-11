export const SITE_TITLE = process.env.SITE_TITLE;
export const INSTA_HANDLE = "/the.pilfered.diaries";
export const INSTA_LINK = `https://instagram.com${INSTA_HANDLE}`;
export const LINKEDIN_LINK = "https://linkedin.com/in/amittras-pal";
export const REPO_LINK = "https://github.com/amittras-pal/the-pilfered-diaries";

export const DISPLAY_TAGS = 3;
export const DATE_FORMATS = {
  date: "MMM DD, 'YY",
  dateTime: "MMM DD, 'YY, HH:MM A",
};

export const CACHE_CFG: RequestInit = {
  next: { revalidate: 24 * 60 * 60 },
};

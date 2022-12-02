import { useState, useEffect } from "react";

const breakpoints = {
  xs: 575,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

/**
 *
 * @param {"xs" | "sm" | "md" | "lg" | "xl"} size Breakpoint size
 * @returns
 */
export const useMediaQuery = (size) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media =
      typeof window !== "undefined"
        ? window.matchMedia(`(min-width: ${breakpoints[size]}px)`)
        : { matches: false };
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    if (typeof window !== "undefined")
      window.addEventListener("resize", listener);
    return () => {
      if (typeof window !== "undefined")
        window.removeEventListener("resize", listener);
    };
  }, [matches, size]);

  return matches;
};

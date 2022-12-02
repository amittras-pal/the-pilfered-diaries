import { useState, useEffect, useCallback } from "react";

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

  const listener = useCallback(({ matches }) => {
    setMatches(matches);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia(`(min-width: ${breakpoints[size]}px)`);
      listener();
      media.addEventListener("change", listener);
      return () => {
        media.removeEventListener("change", listener);
      };
    }
  }, [listener, matches, size]);

  return matches;
};

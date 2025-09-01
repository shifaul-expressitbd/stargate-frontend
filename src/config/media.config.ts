export const MEDIA_URL = `https://cloude.stargate.app/v2/api/files` as string;

// Responsive breakpoints
export const BREAKPOINTS = {
  mobile: 768, // < 768px
  tablet: 1280, // 768px - 1279px
  laptop: 1536, // 1280px - 1535px
  desktop: 1920, // >= 1920px
};

export const SIDEBAR_WIDTHS = {
  mobile: "w-80", // overlay
  tablet: "w-16", // icon-only
  laptop: "w-20", // compact with labels
  desktop: "w-64", // full-width
};

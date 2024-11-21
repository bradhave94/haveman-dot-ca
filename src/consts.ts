import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  TITLE: "Bradley Haveman",
  DESCRIPTION: "A collection of thoughts and projects.",
  EMAIL: "hi@haveman.ca",
  NUM_POSTS_ON_HOMEPAGE: 5,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "A collection of thoughts and projects.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of thoughts and projects.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION:
    "A collection of my projects with links to repositories and live demos.",
};
export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Where I have worked and what I have done.",
};

export const SOCIALS: Socials = [
  {
    NAME: "X",
    HREF: "https://x.com/bradhave",
  },
  {
    NAME: "GitHub",
    HREF: "https://github.com/bradhave94",
  },
  {
    NAME: "LinkedIn",
    HREF: "https://www.linkedin.com/in/bradhave",
  },
];

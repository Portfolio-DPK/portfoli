export type Theme = 'dark' | 'light';

export const setTheme = (t: Theme) => {
  if (document.documentElement.dataset.theme !== t) document.documentElement.dataset.theme = t;
};

type OriginalThemeProps = {
  colors: string[];
  elevations: string[];
  margins: string[];
  defaultTypography: string;
};

type CustomThemeProps = {
  colors: Set<string>;
};

type ThemeProps = Omit<OriginalThemeProps, "colors"> & {
  colors?: CustomThemeProps;
};

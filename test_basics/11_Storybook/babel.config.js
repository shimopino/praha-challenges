module.exports = (api) => {
  api.cache(true);

  return {
    preset: [
      [
        "@babel/preset-env",
        {
          targets: "> 0.25%, not dead",
        },
      ],
      "@babel/preset-react",
      "@babel/preset-typescript",
    ],
  };
};

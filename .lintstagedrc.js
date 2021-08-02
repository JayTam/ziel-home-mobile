module.exports = {
  // Run type-check on changes to TypeScript files
  "**/*.ts?(x)": () => "yarn run type-check",
  // Run Eslint on changes to TypeScript and JavaScript files
  "**/*.(ts|js)?(x)": (filenames) => `eslint --fix ${filenames.join(" ")}`,
  // Run Prettier on changes to all files
  "**/*.(ts|tsx|js|jsx|json|css|less|scss|md)": (filenames) =>
    `prettier --write ${filenames.join(" ")}`,
};

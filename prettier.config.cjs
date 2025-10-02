// Centralized Prettier settings keep formatting consistent across editors and CI.
module.exports = {
  // Match common React conventions: two spaces keeps JSX compact and legible.
  tabWidth: 2,
  // Always include semicolons to avoid ASI pitfalls in shared codebases.
  semi: true,
  // Prefer single quotes in JS/JSX except where escaping becomes messy.
  singleQuote: true,
  // Wrap prose and code at 80 columns to encourage readable diffs.
  printWidth: 80,
  // Include trailing commas where valid to minimize future diff churn.
  trailingComma: 'all',
};

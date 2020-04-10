module.exports = {
  debug: process.env.DB__DEBUG === "true",
  uri: process.env.DB__URI,
  defaultTimeout: Number(process.env.DB__DEFAULT_TIMEOUT),
};

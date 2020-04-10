const dotenv = require("dotenv");
const path = require("path");

console.log(process.cwd());

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const script = require(`./scripts/${process.argv[2]}`);

script
  .exec()
  .then(() => {
    console.log("finished");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(0);
  });

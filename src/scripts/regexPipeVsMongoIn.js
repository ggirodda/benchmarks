const _ = require("lodash");
const mongoose = require("mongoose");
// const Benchmark = require("benchmark");
const databaseService = require("../services/database");

const random = (min = 0, max) => Math.round(Math.random() * max) + min;

const execFnAndGetExecutionTime = async (iterations, fn) => {
  const time = new Date().getTime();

  for (let i = 0; i < iterations; i++) {
    await fn();
  }

  return new Date().getTime() - time;
};

const runBenchmark = async (filter, regexFilter) => {
  const SomeModel = mongoose.model("SomeModel");
  const iterations = random(1000, 2000);

  console.log(`there will be ${iterations} iterations`);

  const $inTime = await execFnAndGetExecutionTime(iterations, async () =>
    SomeModel.find({ someProp: { $in: filter } }),
  );

  console.log(`$in ${$inTime}`);

  const $regexTime = await execFnAndGetExecutionTime(iterations, async () =>
    SomeModel.find({ someProp: { $regex: regexFilter } }),
  );

  console.log(`$regex ${$regexTime}`);

  console.log(
    `the winner is ${
      $regexTime > $inTime ? "$in" : $regexTime < $inTime ? "$regex" : "both"
    }`,
  );
};

module.exports.exec = async () => {
  await databaseService.initialize();
  const SomeModel = mongoose.model(
    "SomeModel",
    new mongoose.Schema({ someProp: { type: String } }),
    "someModels",
  );

  const quantity = 199;

  await SomeModel.create(
    _.times(quantity, (i) => ({ someProp: `${i + 4000}` })),
  );
  let filter = _.times(10, (i) => `4${random(0, 1)}${random(0, 9)}${i}`);

  let regexFilter = new RegExp(filter.join("|"));

  console.log("testing find of non regular expression");
  console.log("running tests with this filters", filter, regexFilter);
  await runBenchmark(filter, regexFilter);

  const filterStrings = _.times(10, (i) => `^4${random(0, 1)}${i}`);

  filter = filterStrings.map((filterString) => new RegExp(filterString));
  regexFilter = new RegExp(filterStrings.join("|"));

  console.log("testing find of regular expression");
  console.log("running tests with this filters", filter, regexFilter);
  await runBenchmark(filter, regexFilter);
};

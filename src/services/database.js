const mongoose = require("mongoose");

const config = require("../config/database");

const Database = class Database {
  constructor() {
    this.uri = config.uri;
  }

  async initialize() {
    const connectConfig = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      poolSize: 10,
      autoIndex: false,
      socketTimeoutMS: config.defaultTimeout,
      autoCreate: true,
    };

    try {
      await mongoose.connect(this.uri, connectConfig);
      await mongoose.connection.dropDatabase();
      console.log("Success connection to db");

      this.setMongooseDefaults();

      mongoose.connection.on("error", (err) => {
        console.error(err, "Mongoose connection error");
      });
    } catch (e) {
      console.error("Fail trying to connect on mongo Database", e);
    }
  }

  async disconnect() {
    await mongoose.disconnect();
  }

  setMongooseDefaults() {
    /* This option will prevent Mongoose from queuing queries until connection
     * to the database is established
     * It will also make Mongoose throw if you try to perform a query before */
    mongoose.set("bufferCommands", false);
    // https://github.com/Automattic/mongoose/issues/6880#issuecomment-424850345
    // TODO Allan remove it when mongoose 6.0 is release
    mongoose.set("useFindAndModify", false);
    mongoose.set("debug", config.debug);
    mongoose.set("runValidators", true);
    mongoose.set("maxTimeMS", config.defaulTimeout);
    mongoose.plugin((schema) => {
      schema.options.strict = "throw";
      schema.options.autoIndex = false;
      schema.options.autoCreate = true;
    });
  }
};

module.exports = new Database();

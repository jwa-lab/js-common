const {StoppableNatsRunner} = require("../StoppableNatsRunner");

const natsRunner = new StoppableNatsRunner(__dirname);

export {
    natsRunner
}

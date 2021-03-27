const appFirst = require("./first/first");
const appThird = require("./third/third");

const PORT_FIRST = process.env.PORT_FIRST || 8080;
const PORT_THIRD = process.env.PORT_THIRD || 8090;

appFirst.listen(PORT_FIRST, () => {
  console.log(`first-site listening on ${PORT_FIRST}`);
})

appThird.listen(PORT_THIRD, () => {
  console.log(`third-site listening on ${PORT_THIRD}`);
})

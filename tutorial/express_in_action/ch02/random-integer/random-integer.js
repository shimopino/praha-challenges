const MAX = 100;

const randomInteger = () => {
  return Math.floor((Math.random() * MAX));
};

module.exports = randomInteger;
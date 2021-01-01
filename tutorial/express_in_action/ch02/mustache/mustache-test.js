const Mustache = require('mustache');
const result = Mustache.render('Hi, {{first}} {{last}}', {
  first: `Nicolas`,
  last: `Cage`
});

console.log(result);
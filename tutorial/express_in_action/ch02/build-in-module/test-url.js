const { parse } = require('path');
const url = require('url');
const parseURL = url.parse('http://www.example.com/profile?name=barry');

console.log(parseURL.protocol); // http:
console.log(parseURL.host)      // www.example.com
console.log(parseURL.pathname)  // /profile
console.log(parseURL.query)     // name=barry
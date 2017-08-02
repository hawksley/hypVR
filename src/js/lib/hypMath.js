//  discuss at: http://phpjs.org/functions/acosh/
//  original by: Onno Marsman
//  example 1: acosh(8723321.4);
//  returns 1: 16.674657798418625
const acosh = (arg) => ( Math.log(arg + Math.sqrt(arg * arg - 1)));

export {
  acosh
};

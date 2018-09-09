const moment = require('moment');
const createdAt = 1234;

let date = moment(createdAt);
console.log(date.format('h:mm a'));
// const date = new Date();
//
// const months = ['Jan', 'Feb'];
// console.log(new Date);

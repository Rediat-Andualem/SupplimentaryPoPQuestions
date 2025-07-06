const cron = require('node-cron');
const { cleanUnlinkedFiles } = require('../Controllers/QuestionC')

// Runs once every 24 hours at midnight
// cron.schedule('0 0 * * *', () => {
//   console.log('Running daily file cleaner...');
//   cleanUnlinkedFiles();
// });


cron.schedule('*/2 * * * *', () => {
  console.log('Running cleaner every 2 minutes...');
  cleanUnlinkedFiles();
});

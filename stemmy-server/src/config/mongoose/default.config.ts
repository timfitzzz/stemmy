let creds =
  `${process.env.STEMMY_DB_USERNAME}:${process.env.STEMMY_DB_PASSWORD}@` || '';

let mongoUrl = (function () {
  switch (process.env.TARGET_DB) {
    case 'test':
      return `mongodb+srv://${creds}testcluster0.b9qix.mongodb.net/default?retryWrites=true&w=majority`;
      break;
    default:
      return 'mongodb://localhost:27017/default';
  }
})();

export default {
  id: 'default',
  url: mongoUrl,
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  debug: true,
};

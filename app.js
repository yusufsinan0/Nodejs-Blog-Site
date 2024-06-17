const path = require('path');
const express = require('express');
const app = express();
const port = 3000;
const hostname = '127.0.0.1';
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const moment = require('moment');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override')

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB\'ye bağlanıldı!'))
.catch((err) => console.error('Bağlantı hatası:', err));

app.use(session({
  secret: 'dsadasdsada',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/test',
    collectionName: 'sessions'
  })
}));

app.engine('handlebars', engine({
  helpers: {
    generateDate: (date, format) => {
      return moment(date).format(format);
    }
  }
}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(fileUpload());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});

app.use((req, res, next) => {
  res.locals.displayLink = req.session.userId ? true : false;
  next();
});

app.use(methodOverride('_method'))

const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin/index')
app.use('/', mainRoutes);
app.use('/users', userRoutes);
app.use('/admin',adminRoutes)

app.listen(port, hostname, () => {
  console.log(`Sunucu http://${hostname}:${port} üzerinde çalışıyor`);
});

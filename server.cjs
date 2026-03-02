const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const bodyParser = require('body-parser');
server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

server.use(middlewares);
server.use(router);

server.listen(3001, () => {
  console.log('--------------------------------------------------');
  console.log('Бэкэнд Encan успешно запущен на порту 3001');
  console.log('--------------------------------------------------');
});
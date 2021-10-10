import * as http from 'http';
import {IncomingMessage, ServerResponse} from 'http';

import * as p from 'path';
import * as fs from 'fs';
import * as url from 'url';

const server = http.createServer();
const publicDir = p.resolve(__dirname, 'public');

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  const {url: path, method, headers} = request;
  const {pathname, search} = url.parse(path);

  let filename = pathname.substr(1);
  if (filename === '') {
    filename = 'index.html';
  }

  if (method!=='GET'){
    response.statusCode = 200;
    response.end(`can not     GET`)
  }

  fs.readFile(p.resolve(publicDir, filename), (error, data) => {
    if (error) {
      if (error.errno === -4058) {
        fs.readFile(p.resolve(publicDir, '404.html'), (error, data) => {
          response.statusCode = 404;
          response.end(data);
        });
      } else if(error.errno === -4068){
        response.statusCode = 403;
        response.end('ni mei quan xian')
      }else {
        response.statusCode = 500;
        response.end('wo bu xing le');
      }
    } else {
      //返回成功
        response.statusCode =200
      response.setHeader('cache-control','piblic,max-age=31536000')
      response.end(data);

    }
  });

});
server.listen('8888');

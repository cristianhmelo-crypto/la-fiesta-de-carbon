// Servidor mínimo para probar el juego localmente (http://localhost:4390).
const http=require('http'),fs=require('fs'),path=require('path');
const port=process.env.PORT||4390;
http.createServer((q,r)=>{const f=path.join(__dirname,'fiesta-carbon.html');r.writeHead(200,{'content-type':'text/html; charset=utf-8'});r.end('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync(f,'utf8')+'</body></html>');}).listen(port);

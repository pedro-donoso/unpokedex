/* defino constantes */
const axios = require("axios");
const http = require("http");
const fs = require("fs");

/* funcion asincrona */
async function getPoke() {
/*   axios imagenes */
  const { data } = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=50");
  return data.results;
}

/*   axios nombres */
async function allPoke(name) {
  const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
  return data;
}

/* creo servidor */
http
  .createServer((req, res) => {
/*     guardado de datos */
    let myProm = [];
    let myTable = [];
    if (req.url == "/") {
  /*     metodos */
      res.writeHead(200, { "Content-Type": "text/html" });
      fs.readFile("index.html", "utf-8", (err, file) => {
        if (err) throw err;
        res.write(file);
        res.end();
      });
    }

/*     condicion */
    if (req.url == "/pokemones") {
      getPoke().then((results) => {
     /*    recorrido */
        results.forEach((p) => {
          let myName = p.name;
          myProm.push(allPoke(myName));
        });
      
   /*      promesa */
          Promise.all(myProm).then((data) => {
            data.forEach((p) => {
             /*  mostrar */
              myTable.push({ nombre: p.name, img: p.sprites.front_default });
            });
      /*       formato */
            res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
            let myDB = JSON.stringify(myTable);
            res.end(myDB);
          });
      
      });
    }

/*    mensaje */
  })
  .listen(3000, () => console.log("Ahora estoy a la escucha del puerto 3000"));

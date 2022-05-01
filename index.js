const http = require("http");
const fs = require("fs");
const url = require("url");
const { nuevoPost, actualizaPost, subirPost } = require("./consultas");

// CREATE DATABASE likeme;
// \c likeme;

// CREATE TABLE posts(
//     id SERIAL PRIMARY KEY,
//     usuario VARCHAR(25),
//     url VARCHAR(1000),
//     descripcion VARCHAR(255),
//     likes INT
// );


//servidor
http.createServer(async (req, res) => {
    if (req.url == "/" && req.method == "GET") {
        fs.readFile("index.html", (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end()
            } else {
                res.setHeader("Content-Type", "Text/Html")
                res.end(data)
            }
        })
    };

    //crea
    if (req.url == "/post" && req.method == "POST") {
        let body
        req.on("data", datos => body = JSON.parse(datos))
        req.on("end", async () => {
            try {
                const datos = await nuevoPost(body)
                res.writeHeader(200, { "Content-Type": "application/json" })
                res.end(JSON.stringify(datos))
            } catch (e) {
                res.statusCode = 500;
                res.end("dramas con el servidor" + e);
            }
        })
    };

    //like
    if (req.url.startsWith("/post?id") && req.method == "PUT") {
        try {
            const { id } = url.parse(req.url, true).query
            await actualizaPost(id)
            res.writeHeader(200, { "Content-Type": "application/json" })
            res.end()
        } catch (e) {
            res.statusCode = 500;
            res.end("ocurrio un problema con el servidor" + e);
        }
    };

    //lee
    if (req.url == "/posts" && req.method == "GET") {
        try {
            const posts = await subirPost()
            res.writeHeader(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify(posts))
        } catch (e) {
            res.statusCode = 500;
            res.end("ocurrio un problema con el servidor" + e);
        }
    };

}).listen(3000, console.log("Servidor 3000 activo"));
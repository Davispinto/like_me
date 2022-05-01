const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "likeme",
    password: "graficas014",
    port: 5432,
    max: 20,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000
});

const nuevoPost = async (post) => {
    const crea = {
        text: "insert into posts (usuario, url, descripcion, likes) values ($1, $2, $3, 0) RETURNING *",
        values: [post.usuario, post.URL, post.descripcion]
    }
    try {
        const result = await pool.query(crea)
        return result.rows
    } catch (error) {
        console.error(error)
    }
};

const actualizaPost = async (id) => {
    const like = {
        text: "update posts set likes = likes + 1 where id = $1 RETURNING *",
        values: [id]
    }
    try {
        const result = await pool.query(like)
        return result.rows
    } catch (error) {
        console.error(error)
    }
};

const subirPost = async () => {
    const subir = {
        text: "select * from posts"
    }
    try {
        const result = await pool.query(subir)
        return result.rows
    } catch (error) {
        console.error(error)
    }
};

module.exports = { nuevoPost, actualizaPost, subirPost }
const postgre = require('../database')
const bookController = {
    getAll: async(req, res) => {
        try {
            const { rows } = await postgre.query("SELECT * FROM books")
            res.json({msg: "OK", data: rows})
        } catch (error) {
            console.error('Error en getAll:', error)
            res.status(500).json({msg: "Error interno del servidor"})
        }
    },
    getById: async(req, res) => {
        try {
            const { id } = req.params
            if (!Number.isInteger(Number(id))) {
                return res.status(400).json({msg: "ID inválido"})
            }
            const { rows } = await postgre.query("SELECT * FROM books WHERE book_id = $1", [id])

            if (rows[0]) {
                return res.json({msg: "OK", data: rows[0]})
            }

            res.status(404).json({msg: "Libro no encontrado"})
        } catch (error) {
            console.error('Error en getById:', error)
            res.status(500).json({msg: "Error interno del servidor"})
        }
    },
    create: async(req, res) => {
        try {
            const { name, price } = req.body

            if (!name || typeof name !== 'string' || name.length > 255) {
                return res.status(400).json({msg: "Nombre inválido"})
            }

            if (!price || typeof price !== 'number' || price <= 0) {
                return res.status(400).json({msg: "Precio inválido"})
            }

            const sql = 'INSERT INTO books(name, price) VALUES($1, $2) RETURNING *'

            const { rows } = await postgre.query(sql, [name, price])

            res.status(201).json({msg: "Libro creado", data: rows[0]})

        } catch (error) {
            console.error('Error en create:', error)
            res.status(500).json({msg: "Error interno del servidor"})
        }
    },
    updateById: async(req, res) => {
        try {
            const { id } = req.params
            const { name, price } = req.body

            if (!Number.isInteger(Number(id))) {
                return res.status(400).json({msg: "ID inválido"})
            }

            if (!name || typeof name !== 'string' || name.length > 255) {
                return res.status(400).json({msg: "Nombre inválido"})
            }

            if (!price || typeof price !== 'number' || price <= 0) {
                return res.status(400).json({msg: "Precio inválido"})
            }

            const sql = 'UPDATE books SET name = $1, price = $2 WHERE book_id = $3 RETURNING *'

            const { rows } = await postgre.query(sql, [name, price, id])

            if (rows[0]) {
                return res.json({msg: "Libro actualizado", data: rows[0]})
            }

            res.status(404).json({msg: "Libro no encontrado"})

        } catch (error) {
            console.error('Error en updateById:', error)
            res.status(500).json({msg: "Error interno del servidor"})
        }
    },
    deleteById: async(req, res) => {
        try {
            const { id } = req.params

            if (!Number.isInteger(Number(id))) {
                return res.status(400).json({msg: "ID inválido"})
            }

            const sql = 'DELETE FROM books WHERE book_id = $1 RETURNING *'

            const { rows } = await postgre.query(sql, [id])

            if (rows[0]) {
                return res.json({msg: "Libro eliminado", data: rows[0]})
            }

            return res.status(404).json({msg: "Libro no encontrado"})
            

        } catch (error) {
            console.error('Error en deleteById:', error)
            res.status(500).json({msg: "Error interno del servidor"})
        }
    }
}

module.exports = bookController
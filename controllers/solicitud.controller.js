const postgre = require('../database')
const solicitudController = {
    crearSolicitud: async(req, res) => {
        try {
            const { nombre_archivo, tamano_archivo, nombre_unico_archivo, correo_envio } = req.body

            if (!nombre_archivo || !tamano_archivo || !nombre_unico_archivo || !correo_envio) {
                return res.status(400).json({
                    status: "error",
                    message: "Todos los campos son obligatorios"
                })
            }

            const sql = 'INSERT INTO TELOTRANSCRIBO_Solicitudes (nombre_archivo, tamano_archivo, nombre_unico_archivo, correo_envio, status, fecha_hora_solicitud) VALUES($1, $2, $3, $4, $5, NOW()) RETURNING *'
            const values = [nombre_archivo, tamano_archivo, nombre_unico_archivo, correo_envio, 'Solicitado']

            const { rows } = await postgre.query(sql, values)
            
            return res.status(201).json({
                status: "success",
                message: "Solicitud creada exitosamente",
                data: rows[0]
            })
        } catch (error) {
            console.error('Error al crear la solicitud:', error)
            return res.status(500).json({
                status: "error",
                message: "Error interno del servidor"
            })
        }
    }
}

module.exports = solicitudController;
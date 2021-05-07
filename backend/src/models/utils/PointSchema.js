const mongoose = require('mongoose')

/**
 * Criando um novo tipo de dados no mongoDb que armazena informações de geolocalização.
 */
const PointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
})

module.exports = PointSchema
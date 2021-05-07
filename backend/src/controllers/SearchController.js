const Dev = require('../models/Dev.model')
const parseStringAsArray = require('../utils/parseStringAsArray')

module.exports = {
  /**
   * Buscar devs em um raio de 10km
   * Filtrar por tecnologia
   * 
   * @param {*} req 
   * @param {*} res 
   */
  async index(req, res) {
    const { latitude, longitude, techs } = req.query

    const techsArray = parseStringAsArray(techs)

    /**
     * Filtrando devs
     */
    const devs = await Dev.find({
      techs: {
        $in: techsArray,
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: 10000
        }
      }
    })

    return res.json({ devs })
  }
}
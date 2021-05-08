import DevModel from "../models/Dev.model";
import { parseStringAsArray } from "../utils";

const SearchController = {
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
    const devs = await DevModel.find({
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

export default SearchController
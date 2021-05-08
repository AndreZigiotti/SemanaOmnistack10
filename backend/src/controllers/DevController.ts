const axios = require('axios')
import DevModel from "../models/Dev.model";
import { parseStringAsArray } from "../utils";
import { findConnections, sendMessage } from "../websocket";

// Funções que um controller geralmente possui: index, show, store, update e destroy
const DevController = {
  async index(req, res) {
    const devs = await DevModel.find()

    return res.json(devs)
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body

    /**
     * Realizando consulta no banco para verificação de usuário já existente
     */
    let dev = await DevModel.findOne({ github_username })
    
    if(!dev) {
      const response = await axios.get(`https://api.github.com/users/${github_username}`)
    
      const techsArray = parseStringAsArray(techs)
      let { name, avatar_url, bio, login } = response.data
      if(!name) name = login
    
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    
      /**
       * Realizando a inserção de dados no mongoDb
       */
      dev = await DevModel.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      })

      /**
       * Filtrando conexões que estão até 10km de distância e que o novo dev tenha uma das tecnologias filtradas
       */
      const sendSocketMessageTo = findConnections({ latitude, longitude }, techsArray)

      sendMessage(sendSocketMessageTo, 'new-dev', dev)
    }
  
    return res.json(dev)
  }
}

export default DevController
const socketio = require('socket.io');
import { getDistanceFromLatLonInKm, parseStringAsArray } from "./utils";

let io
const connections = []

const setupWebSocket = (server) => {
  io = socketio(server)

  io.on('connection', socket => {
    const { latitude, longitude, techs } = socket.handshake.query

    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      techs: parseStringAsArray(techs)
    })

    console.log(connections)
  })
}

const findConnections = (coordinates, techs) => {
  return connections.filter(con => {
    return getDistanceFromLatLonInKm(coordinates, con.coordinates) < 10 && con.techs.some(item => techs.includes(item))
  })
}

const sendMessage = (to, message, data) => {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data)
  })
}

export {
  setupWebSocket,
  findConnections,
  sendMessage
}
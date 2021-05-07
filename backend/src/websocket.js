const socketio = require('socket.io')
const calculateDistance = require('./utils/calculateDistance')
const parseStringAsArray = require('./utils/parseStringAsArray')

let io
const connections = []

exports.setupWebSocket = (server) => {
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

exports.findConnections = (coordinates, techs) => {
  return connections.filter(con => {
    return calculateDistance(coordinates, con.coordinates) < 10 && con.techs.some(item => techs.includes(item))
  })
}

exports.sendMessage = (to, message, data) => {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data)
  })
}
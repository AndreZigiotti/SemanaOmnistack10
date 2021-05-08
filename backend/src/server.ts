import express from 'express';
import { connect } from 'mongoose';
import * as cors from 'cors'
import * as http from 'http'
import routes from './routes';
import { setupWebSocket } from './websocket';

const app = express()
const server = new http.Server(app)

setupWebSocket(server)

connect('mongodb+srv://omnistack:omnistack@cluster0.4li7x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.use(cors.default( { origin: 'http://localhost:3000' } ))
app.use(express.json())
app.use(routes)

server.listen(3333)
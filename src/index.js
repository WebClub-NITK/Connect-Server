const http = require('http')
const app = require('./app')
const { PORT } = require('./utils/config')
require('../populate')

const server = http.createServer(app)

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

const PORT = 8000
const webSocketServer = require('websocket').server
const http = require('http')
const Game = require('./mainGame')

const server = http.createServer()
server.listen(PORT)
console.log('Server listening...')

let newGame = new Game()
let board = newGame.board
// console.log(board)

const firstTurn = 0
// console.log(firstTurn)
let countTurn = 0
// console.log(countTurn)
const wsServer = new webSocketServer({
    httpServer: server
})

const client = {}

const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    return s4() + s4() + '-' + s4()
}


wsServer.on('request', (request) => {
    let userID = getUniqueID()
    console.log((new Date()) + 'Recieved a new connection from origin' + request.origin + '.')

    const connection = request.accept(null, request.origin)
    client[userID] = connection
    console.log('connected: ' + userID + 'in' + Object.getOwnPropertyNames(client))
    for(key in client){
        client[key].sendUTF(JSON.stringify({board: board, turn: firstTurn}))
        // console.log('sent each to: ', client[key])
    }
    connection.on('message', (each) => {
        // console.log(each)
        if(each.type === 'utf8'){
            let newData = JSON.parse(each.utf8Data)
            let currentTurn = newData.turn
            // console.log('Recieved turn', each.utf8Data, currentTurn)
            if(currentTurn === 1){
                currentTurn = 0
            } else if(currentTurn === 0){
                currentTurn = 1
            }
            if(newData.board !== board){
                board = newData.board
                // console.log('CHANGE BOARD HERE', board)
            }
            countTurn++
            // console.log('currentTurnAfterChange', currentTurn, countTurn)
            for(key in client){
                client[key].sendUTF(JSON.stringify({board: board, turn: currentTurn}))
                // console.log('sent each to: ', client[key])
            }
        }
    })
})
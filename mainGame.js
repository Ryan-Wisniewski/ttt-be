function Board() {
    let board = []
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
          board.push({x: i, y: j, bool: null})
        }
    }
    // console.log(board)
    this.board = board
}

module.exports = Board
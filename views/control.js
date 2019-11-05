function switchAutoModeState(state){
    //console.log(`include ok ${state}`)
    io.sockets.emit('switchAutoModeState', { state: state })
}
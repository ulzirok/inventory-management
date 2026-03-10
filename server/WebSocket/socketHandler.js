const { handleJoin, handleSendMessage } = require('./socketController')

module.exports = function (ws, msg, aWss) {
  const data = JSON.parse(msg);
  const { method } = data;
  
  switch (method) {
    case 'JOIN_ROOM':
      handleJoin(ws, data);
      break;
    
    case 'SEND_MESSAGE':
      handleSendMessage(ws, data, aWss);
      break;
  }
}
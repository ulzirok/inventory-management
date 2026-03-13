const prisma = require('../prisma');

const handleJoin = (ws, data) => {
  const { roomId } = data;
  ws.roomId = String(roomId);
};

const handleSendMessage = async (ws, data, aWss) => {
  const { text } = data
  const roomId = Number(ws.roomId)
  const userId = Number(ws.userId)
  if (!roomId || !text || !userId) return;
  
  try {
    const comment = await prisma.comment.create({
      data: {
        text,
        inventoryId: roomId,
        authorId: userId
      },
      include: {
        author: { select: { id: true, name: true } }
      }
    });

    broadcast(aWss, ws.roomId, {
      method: 'NEW_MESSAGE',
      message: comment
    })
  } catch (err) {
    console.error(err.message);
    
    ws.send(JSON.stringify({
      method: "ERROR",
      message: "Failed to save message"
    }));
  }
};

const handleClose = (ws, aWss) => {
  ws.roomId = null;
  ws.userId = null;
};


const broadcast = (aWss, roomId, data) => {
  aWss.clients.forEach(client => {
    if (client.readyState === 1 && String(client.roomId) === String(roomId)) {
      client.send(JSON.stringify(data));
    }
  });
};

module.exports = {
  handleJoin,
  handleSendMessage,
  handleClose
};
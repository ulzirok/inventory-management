const prisma = require("../prisma");
const dbx = require("../dropbox");

module.exports.createTicket = async (req) => {
  const { summary, priority, link, inventoryId } = req.body;
  
  let inventoryTitle = "General (No specific inventory)";
  if (inventoryId) {
    const inventory = await prisma.inventory.findUnique({
      where: { id: Number(inventoryId) },
      select: { title: true }
    });
    if (inventory) inventoryTitle = inventory.title;
  }
  
  const ticketData = {
    "Reported by": req.user?.email || "Guest",
    "Inventory": inventoryTitle,
    "Link": link || "N/A",
    "Priority": priority || "Average",
    "Summary": summary,
    "AdminEmails": ["userchikuser@gmail.com"]
  };

  const fileName = `ticket-${Date.now()}.json`;

  await dbx.filesUpload({
    path: `/${fileName}`,
    contents: Buffer.from(JSON.stringify(ticketData, null, 2)),
    mode: 'add'
  });

  return { success: true };
};

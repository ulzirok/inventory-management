-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT,
    "idFormat" TEXT NOT NULL DEFAULT 'ITEM-####',
    "authorId" INTEGER NOT NULL,
    "str1_label" TEXT,
    "str2_label" TEXT,
    "str3_label" TEXT,
    "int1_label" TEXT,
    "int2_label" TEXT,
    "int3_label" TEXT,
    "txt1_label" TEXT,
    "txt2_label" TEXT,
    "txt3_label" TEXT,
    "bool1_label" TEXT,
    "bool2_label" TEXT,
    "bool3_label" TEXT,
    "date1_label" TEXT,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "customId" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "string_1" TEXT,
    "string_2" TEXT,
    "string_3" TEXT,
    "integer_1" INTEGER,
    "integer_2" INTEGER,
    "integer_3" INTEGER,
    "text_1" TEXT,
    "text_2" TEXT,
    "text_3" TEXT,
    "boolean_1" BOOLEAN,
    "boolean_2" BOOLEAN,
    "boolean_3" BOOLEAN,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Item_inventoryId_customId_key" ON "Item"("inventoryId", "customId");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

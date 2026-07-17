-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "showDuration" TEXT;

-- CreateTable
CREATE TABLE "SetlistItem" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SetlistItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SetlistItem" ADD CONSTRAINT "SetlistItem_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

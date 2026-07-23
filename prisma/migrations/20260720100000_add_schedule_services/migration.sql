-- CreateTable
CREATE TABLE "ShowScheduleService" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "note" TEXT,
    "price" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ShowScheduleService_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShowScheduleService" ADD CONSTRAINT "ShowScheduleService_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "ShowSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowScheduleService" ADD CONSTRAINT "ShowScheduleService_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "NegativeFeedback" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL DEFAULT 'Khách',
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "eventType" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NegativeFeedback_pkey" PRIMARY KEY ("id")
);

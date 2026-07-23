-- CreateTable
CREATE TABLE "ContentOverride" (
    "key" TEXT NOT NULL,
    "vi" TEXT,
    "en" TEXT,
    "ru" TEXT,
    "zh" TEXT,
    "ko" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentOverride_pkey" PRIMARY KEY ("key")
);

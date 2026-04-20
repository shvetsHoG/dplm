-- CreateTable
CREATE TABLE "contract_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "contract_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "week_days" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "is_weekend" BOOLEAN NOT NULL,
    "number" INTEGER NOT NULL,
    "shortname" TEXT NOT NULL,

    CONSTRAINT "week_days_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "week_days_number_key" ON "week_days"("number");

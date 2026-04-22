-- CreateTable
CREATE TABLE "event_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "event_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_types_name_key" ON "event_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "event_types_color_key" ON "event_types"("color");

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "desc" TEXT NOT NULL,
    "start_dt" TIMESTAMP(3) NOT NULL,
    "end_dt" TIMESTAMP(3) NOT NULL,
    "event_type_id" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_event_type_id_fkey" FOREIGN KEY ("event_type_id") REFERENCES "event_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

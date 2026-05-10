export const getDateToYMD = (date: Date): string => {
  const currentDate = new Date(new Date(date).withTimezone().setHours(0, 0, 0, 0));
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    month: "2-digit",
    day: "2-digit"
  });

  const parts = formatter.formatToParts(currentDate);

  return `${currentDate.getFullYear()}-${parts.find((p) => p.type === "month")?.value}-${parts.find((p) => p.type === "day")?.value}`;
};

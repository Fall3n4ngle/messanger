export function formatDate(inputDateString: Date | null) {
  const inputDate = new Date(inputDateString ?? new Date());
  const currentDate = new Date();

  if (
    inputDate.getDate() === currentDate.getDate() &&
    inputDate.getMonth() === currentDate.getMonth() &&
    inputDate.getFullYear() === currentDate.getFullYear()
  ) {
    const formattedTime =
      inputDate.getHours().toString().padStart(2, "0") +
      ":" +
      inputDate.getMinutes().toString().padStart(2, "0");
    return formattedTime;
  }

  const oneWeekAgo = new Date(currentDate);
  oneWeekAgo.setDate(currentDate.getDate() - 7);

  if (inputDate > oneWeekAgo) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const formattedDay = daysOfWeek[inputDate.getDay()];
    return formattedDay;
  }

  const formattedDate =
    inputDate.getDate().toString().padStart(2, "0") +
    "." +
    (inputDate.getMonth() + 1).toString().padStart(2, "0") +
    "." +
    inputDate.getFullYear();
  return formattedDate;
}

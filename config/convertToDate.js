export const convertToDate = (int) => {
  const baseDate = new Date("1900-01-01");
  const targetDate = new Date(
    baseDate.getTime() + (int - 2) * 24 * 60 * 60 * 1000
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = months[targetDate.getMonth()];
  const day = targetDate.getDate();
  const year = targetDate.getFullYear();

  return `${month} ${day}, ${year}`;
};

export const formatNumber = (number) => {
    return number.replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };
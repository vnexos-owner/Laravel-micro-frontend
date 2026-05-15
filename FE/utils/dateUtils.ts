export const formatDate = (date: string | undefined) => {
  if (!date) return date;

  return new Date(date).toLocaleDateString();
};
export const toStringDate = (date: any) => {
  const { year, month, day } = date;
  const dateString = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return dateString;
};

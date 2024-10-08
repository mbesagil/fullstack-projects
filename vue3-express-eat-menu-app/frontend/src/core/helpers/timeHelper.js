// timeType: "onlyYear";
// timeType: "onlyHours";
// timeType: "both";

function convertToCustomFormat(dateString) {
  const date = new Date(dateString);
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() is zero-indexed
  const year = date.getFullYear();
  return {
    both: `${seconds}.${minutes}.${hours} - ${day}.${month}.${year}`,
    onlyYear: `${day}.${month}.${year}`,
    onlyHours: `${seconds}.${minutes}.${hours}`,
  };
}

export { convertToCustomFormat };

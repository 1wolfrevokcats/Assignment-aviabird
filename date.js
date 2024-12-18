function getDate(date) {
  if (!date) return "";

  const d = new Date(date);
  let dd = d.getDate().toString();
  let mm = (d.getMonth() + 1).toString();
  let yyyy = d.getFullYear().toString();

  if (+dd < 10) dd = "0" + dd;
  if (+mm < 10) mm = "0" + mm;

  return `${dd}/${mm}/${yyyy}`;
}

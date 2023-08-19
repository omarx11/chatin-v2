export const dateStyle = (data) => {
  const f = Intl.DateTimeFormat("en-us", {
    dateStyle: "long",
    timeStyle: "short",
  });
  return f.format(new Date(data));
};

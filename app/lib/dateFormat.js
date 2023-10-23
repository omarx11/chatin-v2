export const dateStyle = (data) => {
  const f = Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  });
  return f.format(new Date(data));
};

export const readyToSave = function (validators) {
  for (const validator of validators) {
    if (validator.condition()) {
      return { ready: false, msg: validator.msg };
    }
  }
  return { ready: true, msg: "" };
};

export const formatDate = (value) => {
  return value.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

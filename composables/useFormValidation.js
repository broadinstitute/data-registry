export default function (formId, optionalCheck = undefined) {
  const form = document.getElementById(formId);
  !!optionalCheck && optionalCheck();
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return false;
  }
  return true;
}

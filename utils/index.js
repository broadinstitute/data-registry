export const toNumber = function (input){
  let floatInput = parseFloat(input);
  return Number.isNaN(floatInput) ? null : floatInput;
}

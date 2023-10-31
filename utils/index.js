export const toNumber = function (str){
    const num = parseFloat(str);
    // Safeguards against odd behavior like '11a' parsing as 11
    if (Number.isNaN(num) || num.toString() !== str){
        return null;
    }
    return num;
}
export const readyToSave = function (validators){
    for (let validator of validators){
        if (validator.condition()){
            return { ready: false, msg: validator.msg};
        }
    }
    return { ready: true, msg: ""};
}
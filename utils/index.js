export const toNumber = function (str){
    const num = parseFloat(str);
    // Safeguards against odd behavior like '11a' parsing as 11
    if (Number.isNaN(num) || num.toString() !== stripZeroes(str)){
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
function stripZeroes(str){
    while(str.charAt(0) === '0'){
        str = str.slice(1);
    }
    if (str.includes(".")){
        while(str.charAt(str.length - 1) === '0'){
            str = str.slice(0, -1);
        }
    }
    if (str.charAt(0) === '.'){
        str = `0${str}`;
    }
    if (str.charAt(str.length - 1) === '.'){
        str = str.slice(0, -1);
    }
    return str;
}
export const readyToSave = function (validators){
    for (let validator of validators){
        if (validator.condition()){
            return { ready: false, msg: validator.msg};
        }
    }
    return { ready: true, msg: ""};
}
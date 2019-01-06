//表单验证
// 不使用策略模式
var registerForm = document.getElementById('registerForm')
registerForm.onsubmit = function() {
    if(registerForm.userName.vlaue == '') {
        alert()
        return false
    }
    if(registerForm.password.value.length < 8) {

    }
    if(!/(!1[3|5|8][0-9]{9}$)/.test(registerForm.phoneNumber.value)) {

    }
}
//使用策略模式
var strategies = {
    isNonEmpty: function(value, errMsg) {
        if (value == '') {
            return errMsg
        }
    },
    minLength: function(value, length, errorMsg) {
        if (value.length < length) {
            return errorMsg
        }
    },
    isMobile: function(valuem, errorMsg) {
        if ( !/(^1[3|5|8][0-9]{9}$)/.test( value )) {
            return errorMsg
        }
    }
}
var Validator = function(){
    this.cache = []
}
Validator.prototype.add = function() {
    var ary = rule.split(':')
}
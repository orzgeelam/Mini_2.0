/**
 * wx.showModal提示
 * @param msg       string      对话框提示信息
 * @param title     string      对话框标题
 * @param cancel    bool        是否开启取消功能
 * @param callback  function    点击确认后回调
 */
function Model(msg, title, cancel, callback) {
    if (typeof title == 'function') {
        callback = title
        title = '提示'
    }
    if (typeof cancel == 'function') {
        callback = cancel
        cancel = false
    }
    title = title || '提示';
    wx.showModal({
        title: title.toString(),
        content: msg.toString(),
        showCancel: cancel || false,
        success: function(res) {
            if (res.confirm) {
                // 点击确认后执行操作
                typeof callback == "function" && callback();
            }
        },
    });
}

/**
 * wx.showToast提示
 * @param msg       string      提示框内容
 * @param icon      string      提示框图标 loading/success/none
 * @param duration  int         提示框隐藏时间
 * @param callback  function    提示框成功后回调
 */
function Toast(msg, icon, duration, callback) {
    if (typeof icon == 'function') {
        callback = icon
        icon = 'none'
    }
    if (typeof duration == 'function') {
        callback = duration
        duration = 1500
    }
    wx.showToast({
        title: msg.toString(),
        icon: icon || 'none',
        duration: duration || 1500,
        mask: true,
        success() {
            callback && (setTimeout(function() {
                callback();
            }, duration || 1500));
        },
    });
}

/**
 * 判断字符串是否在数组中
 * @param stringToSearch
 * @param arrayToSearch
 * @returns {boolean}
 */
function In_array(stringToSearch, arrayToSearch) {
    for (var s = 0; s < arrayToSearch.length; s++) {
        var thisEntry = arrayToSearch[s].toString();
        if (thisEntry == stringToSearch) {
            return true;
        }
    }
    return false;
}
/**
 * 验证手机正则
 */
function Mobile(mobile, type) {
    type = type || true
    if (type && !mobile) {
        Common.Toast('请输入手机号码');
        return false;
    }
    if (!(/^(0|86|17951)?1[0-9]{10}$/.test(mobile))) {
        Toast('请输入正确的手机号码');
        return false;
    }
    return true;
}
/**
 * 验证身份证号正则
 */
function ID_number(id, type) {
    type = type || true
    if (type && !id) {
        Common.Toast('请输入身份证号码');
        return false;
    }
    if (!(/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(id))) {
        Toast('请输入正确的身份证号码');
        return false;
    }
    return true;
}

module.exports = {
    Model: Model, // 对话框
    Toast: Toast, // 提示框
    In_array: In_array,
    ID_number: ID_number,
    Mobile: Mobile,
};
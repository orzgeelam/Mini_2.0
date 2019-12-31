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

module.exports = {
    Model: Model, // 对话框
    Toast: Toast, // 提示框
};
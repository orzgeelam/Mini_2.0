const Common = require('Common.js');
var _this;

class Http {
	/**
	 * 初始化方法
	 */
	constructor(options) {
		if (!options.Web_Url) {
			throw Error('Web_Url不能为空');
		}
		_this           = this;
		this.Web_Url    = options.Web_Url;
		this.Mini_Token = options.Mini_Token || 'ISMINIAPP';
	};

	/**
	 * GET请求
	 * @param url       string      请求地址
	 * @param data      object      请求数据
	 * @param success   function    请求成功后回调
	 * @param fail      function    请求失败后回调
	 * @param complete  function    请求结束后回调
	 */
	Get(url, data, success, fail, complete) {
		wx.showNavigationBarLoading();
		if (typeof data == 'function') {
			success = data;
			data    = {};
		}
		// 构造请求参数
		data = Normal_Data(data);
		// 发起http请求
		wx.request({
			url   : Verify_url(url),
			header: {
				'content-type': 'application/json',
				'openid'      : wx.getStorageSync('openid') || '',
			},
			data  : data,
			success(res) {
				if (Normal_Dispose(res.data.code, res.data.msg)) {
					return false;
				} else {
					success && success(res.data);
				}
			},
			fail(res) {
				Model(res.msg, function () {
					fail && fail(res);
				});
			},
			complete(res) {
				wx.hideNavigationBarLoading();
				complete && complete(res);
			},
		});
	}

	/**
	 * POST请求
	 * @param url       string      请求地址
	 * @param data      object      请求数据
	 * @param success   function    请求成功后回调
	 * @param fail      function    请求失败后回调
	 * @param complete  function    请求结束后回调
	 */
	Post(url, data, success, fail, complete) {
		wx.showNavigationBarLoading();
		if (typeof data == 'function') {
			success = data;
			data    = {};
		}
		// 构造请求参数
		data = Normal_Data(data);
		// 发起http请求
		wx.request({
			url   : Verify_url(url),
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'openid'      : wx.getStorageSync('openid') || '',
			},
			method: 'POST',
			data  : data,
			success(res) {
				if (Normal_Dispose(res.data.code, res.data.msg)) {
					return false;
				} else {
					success && success(res.data);
				}
			},
			fail(res) {
				Common.Model(res.msg, function () {
					fail && fail(res);
				});
			},
			complete(res) {
				wx.hideNavigationBarLoading();
				complete && complete(res);
			},
		});
	}

	/**
	 * 表单提交
	 */
	Submit(url, data, success, fail, complete) {
		wx.showLoading({
			title: '请稍后',
			mask : true,
		});
		if (typeof data == 'function') {
			success = data;
			data    = {};
		}
		// 构造请求参数
		data = Normal_Data(data);
		// 发起http请求
		wx.request({
			url   : Verify_url(url),
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'openid'      : wx.getStorageSync('openid') || '',
			},
			method: 'POST',
			data  : data,
			success(res) {
				if (Normal_Dispose(res.data.code, res.data.msg)) {
					return false;
				} else {
					success && success(res.data);
				}
			},
			fail(res) {
				Common.Model(res.msg, function () {
					fail && fail(res);
				});
			},
			complete(res) {
				wx.hideLoading();
				complete && complete(res);
			},
		});
	}

	/**
	 * 获取openid，sessionkey，unionid
	 * @param url
	 * @param success
	 */
	Get_openid(url, success) {
		if (typeof url == 'function') {
			success = url;
			url     = '';
		}
		url = url || 'api/Mini/get_openid';
		wx.login({
			success: res => {
				if (res.code) {
					_this.Get(url, {
						code: res.code,
					}, function (e) {
						if (e.code) {
							wx.setStorageSync('openid', e.openid);
							wx.setStorageSync('session_key', e.session_key);
							success && success(e);
						} else {
							console.log('获取失败！' + e.errMsg);
						}
					});
				} else {
					console.log('登录失败！' + res.errMsg);
				}
			},
		});
	}

	/**
	 * 获取fromID
	 * @param formid
	 * @returns {boolean}
	 */
	saveFormId(formid) {
		if (typeof formid == 'undefined' || !formid || formid == 'the formId is a mock one') {
			return false;
		}
		_this.Post('api/Mini/saveFormId', {
			formid: formid,
			openid: openid,
		}, function (res) {
			console.log('formId', res);
		}, function (res) {
			console.log('接口调用失败', res);
		});
	}

	/**
	 * 获取列表
	 * @param that object 获取列表页的页面对象
	 * @param url string Get请求地址
	 * @param data object 请求参数
	 * @param success function 回调方法
	 */
	GetList(that, url, data, success) {
		data       = data || {};
		data.page  = that.data.page || 1; // 获取当前页码
		data.limit = that.data.limit || 8; // 获取每页数量
		if (typeof that.data.on_off == 'undefined') {
			that.setData({
				on_off: true,
			});
		}
		if (typeof that.data.nothing == 'undefined') {
			that.setData({
				nothing: false,
			});
		}
		if (typeof that.data.none_show == 'undefined') {
			that.setData({
				none_show: false,
			});
		}
		if (typeof that.data.list == 'undefined') {
			that.setData({
				list: [],
			});
		}
		if (!that.data.nothing && that.data.on_off) {
			// 判断是否有数据，且开关是否打开
			that.setData({
				on_off   : false,
				none_show: false,
			});
			_this.Get(url, data, function (res) {
				if (that.data.page == 1) {
					var list = [];
				} else {
					var list = that.data.list;
				}
				list     = list.concat(res.list);
				var page = parseInt(data.page) + 1;
				that.setData({
					list          : list,
					page          : page,
					total         : res.total,
					nothing       : res.nothing,
					none_show     : true,
					on_off        : true,
					list_component: {
						show  : true,
						none  : res.total,
						nomore: res.nothing,
					},
				});
				success && success(res);
			});
		}
	}
}

/**
 * 网址正则判断完整
 * @param url string  URL地址
 * @return {string}
 */
function Verify_url(url) {
	var reg = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/;
	// 判断是否是完整http|https|ftp地址
	if (reg.test(url)) {
		// 直接请求当前地址
		return url;
	} else {
		// 自定义方法短链接,拼接app.js中设置的请求链接
		return _this.Web_Url + url;
	}
}

/**
 * 填充默认data值
 */
function Normal_Data(data) {
	data = data || {};
	// 判断缓存中openid
	if (wx.getStorageSync('openid')) {
		data.token = wx.getStorageSync('openid');
	}
	// 判断缓存中user_id
	if (!data.user_id) {
		if (wx.getStorageSync('user_id')) {
			data.user_id = wx.getStorageSync('user_id');
		}
	}
	// 写入小程序验证数据
	data.Mini_Token = _this.Mini_Token;
	return data;
}

/**
 * http请求后默认操作
 */
function Normal_Dispose(code, msg) {
	msg = msg || '';
	switch (code) {
		case 0:
			// 默认报错方法：返回code为0，提示框提示报错信息
			Common.Model(msg);
			return true;
			break;
		case 88:
			// 默认返回
			Common.Toast(msg, function () {
				wx.navigateBack();
			});
			return true;
			break;
		case '08':
			Common.Model(msg, function () {
				wx.navigateBack();
			});
			return true;
			break;
		default:
			return false;
			break;
	}
}

module.exports = Http;
const App = getApp();
Component({
	properties: {
		save_url: String,
	},
	data      : {
		name_show  : false,
		mobile_show: false,
	},
	methods   : {
		// 授权昵称
		name_auth(e) {
			this.setData({
				name_show  : true,
				mobile_show: false,
			});
		},
		// 授权手机号
		mobile_auth() {
			this.setData({
				name_show  : false,
				mobile_show: true,
			});
		},
		// 关闭弹窗
		close() {
			this.setData({
				name_show  : false,
				mobile_show: false,
			});
		},
		// 用户信息授权
		bindGetUserInfo(e) {
			var _this    = this;
			var userInfo = e.detail.userInfo;
			save_userinfo(this.data.save_url, e.detail.userInfo, function (res) {
				_this.triggerEvent('userInfo', {
					userInfo: userInfo,
				});
				_this.setData({
					name_show  : false,
					mobile_show: true,
				});
			});
		},
		// 手机号授权
		getPhoneNumber(e) {
			var _this      = this;
			var sessionKey = wx.getStorageSync('session_key') || '';
			if (!sessionKey) {
				App.Http.Get_openid(function () {
					decode_mobile(_this, e);
				});
			} else {
				decode_mobile(_this, e);
			}
		},
	},
});

function save_userinfo(url, data, cb) {
	App.Http.Post(url, data, function (res) {
		if (res.code == 1) {
			typeof cb == 'function' && cb(res);
		}
	});
}

function decode_mobile(_this, e) {
	App.Http.Get('api/mini/decodemobile', {
		sessionKey   : wx.getStorageSync('session_key'),
		encryptedData: e.detail.encryptedData,
		iv           : e.detail.iv,
	}, function (res) {
		save_userinfo(_this.data.save_url, res, function (res1) {
			_this.triggerEvent('userMobile', {
				userMobile: res,
			});
			_this.setData({
				name_show  : false,
				mobile_show: false,
			});
		});
	});
}
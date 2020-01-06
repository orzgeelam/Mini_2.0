const App = getApp()
Component({
    properties: {

    },
    data: {
        name_show: false,
        mobile_show: false,
    },
    methods: {
        // 授权昵称
        name_auth(e) {
            this.setData({
                name_show: true,
                mobile_show: false
            })
        },
        // 授权手机号
        mobile_auth() {
            this.setData({
                name_show: false,
                mobile_show: true
            })
        },
        // 关闭弹窗
        close() {
            this.setData({
                name_show: false,
                mobile_show: false
            })
        },
        // 用户信息授权
        bindGetUserInfo(e) {
            this.triggerEvent('userInfo', {
                userInfo: e.detail.userInfo
            }, {})
            // 授权手机号
            this.setData({
                name_show: false,
                mobile_show: true
            });
        },
        // 手机号授权
        getPhoneNumber(e) {
			var _this = this
			var sessionKey = wx.getStorageSync('session_key')||''
			if (!sessionKey){
				App.Http.Get_openid(function(){
					App.Http.Get('api/mini/decodemobile', {
						sessionKey: wx.getStorageSync('session_key'),
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv,
					}, function (res) {
						console.log(res)
						_this.triggerEvent('userInfo', {
							userInfo: res
						})
					});
				})
			} else {
				App.Http.Get('api/mini/decodemobile', {
					sessionKey: wx.getStorageSync('session_key'),
					encryptedData: e.detail.encryptedData,
					iv: e.detail.iv,
				}, function (res) {
					console.log(res)
					_this.triggerEvent('userMobile', {
						userMobile: res
					})
				});
			}
			this.setData({
				name_show: false,
				mobile_show: false
			})
        },
    }
})
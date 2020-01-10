const qiniuUploader = require("./SDK/qiniuUploader.js");
var _this;

class Qiniu {
	/**
	 * 初始化方法
	 * @param options 初始化参数配置七牛
	 */
	constructor(options) {
		if (!options.Img_Url) {
			throw Error('Img_Url不能为空');
		}
		if (!options.Web_Url) {
			throw Error('Web_Url不能为空');
		}
		if (!options.Project_name) {
			throw Error('Project_name不能为空');
		}
		_this             = this;
		this.Img_Url      = options.Img_Url;
		this.Web_Url      = options.Web_Url;
		this.Project_name = options.Project_name;
		this.Qiniu_domain = options.Qiniu_domain || 'images2';
		this.Qiniu_region = options.Qiniu_region || 'ECN';
		new Get_Token();
	};

	/**
	 * 上传图片到七牛
	 * @param num 图片上传数量
	 * @param callback 回调方法
	 * @constructor
	 */
	Up_img(num, callback) {
		wx.chooseImage({
			count     : num || 9, // 默认9
			sizeType  : ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success   : function (res) {
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
				var tempFilePaths = res.tempFilePaths;
				for (var i = 0; i < tempFilePaths.length; i++) {
					var filePath = tempFilePaths[i];
					console.log(filePath);
					// 交给七牛上传
					qiniuUploader.upload(filePath, function (e) {
						if (typeof callback == "function") {
							var result = {
								url     : '/' +e.key,
								full_url: _this.Img_Url + '/' + e.key,
							};
							callback(result);
						}
					}, function (error) {
						console.error('error: ' + JSON.stringify(error));
					}, {
						region                : _this.Qiniu_region,
						uptoken               : _this.Upload_token,
						domain                : _this.Qiniu_domain,
						shouldUseQiniuFileName: false,
						key                   : Img_name(filePath),
					}, function (progress) {
						// console.log('上传进度', progress.progress)
						// console.log('已经上传的数据长度', progress.totalBytesSent)
						// console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend)
					});
				}
			},
		});
	}
}

module.exports = Qiniu;

/**
 * 图片上传名称
 * @return {string}
 */
function Img_name(filePath) {
	var date    = new Date();
	var year    = date.getFullYear();
	var month   = date.getMonth() + 1;
	month       = (month < 10 ? "0" + month : month);
	var strDate = date.getDate();
	var mydate  = (year.toString() + month.toString() + strDate.toString());
	return _this.Project_name + '/' + mydate + '/' + filePath.substr(-40, 40);
}

/**
 * 获取七牛上传Token
 * @constructor
 */
function Get_Token() {
	wx.request({
		url     : _this.Web_Url,
		data    : {},
		header  : {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		method  : "POST",
		dataType: "json",
		success : function (ret) {
			_this.Upload_token = ret.data.upToken;
		},
		fail    : function (e) {
			throw Error('upToken获取失败');
		},
	});
}
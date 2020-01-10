// Mini_2.0/component/banner/banner.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		images: Object
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		current: 0
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		swiperchange(e) {
			this.setData({
				current: e.detail.current,
			});
		},
	}
})
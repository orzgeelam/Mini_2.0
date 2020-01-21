/**
 * 图片预加载组件
 */
Component({
  properties: {
    //默认图片
    defaultImage: {
      type: String,
      value: '../../images/loading.gif'
    },
    //原始图片
    originalImage: String,
    width: String,
    height: String,
    //图片剪裁mode，同Image组件的mode
    mode: {
      type: String,
      value: 'widthFix'
    }
  },
  data: {
    finishLoadFlag: false
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      console.log(this.is)
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods: {
    finishLoad: function (e) {
      this.setData({
        finishLoadFlag: true
      })
    },
    onLoad: function () {
      console.log(this.data.originalImage)
    }
  }
})
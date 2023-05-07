//题目的类型
export default {
  //文本分类
  textTypeArray: [{
      text: '单行填空',
      tag: 'single-input'
    },
    {
      text: '多行填空',
      tag: 'textarea'
    }
  ],
  //选择题分类
  selectTypeArray: [{
    text: '单选题',
    tag: 'radio'
  }, {
    text: '多选题',
    tag: 'checkbox'
  }, {
    text: '下拉题',
    tag: 'dropdown'
  }],
  //对题目进行编辑信息
  configTypeArray: [{
    text: '添加图片（标题）',
    id: 1
  }, {
    text: '添加题目说明',
    id: 2
  }, {
    text: '复制题目',
    id: 3
  },{
    text: '添加为常用题',
    id: 4
  }],
  //对日期进行编辑信息
  configTypeDate: [{
    text: '年 月',
    tag: 'month'
  }, {
    text: '年 月 日',
    tag: 'day'
  }, {
    text: '年 月 日 时 分',
    tag: 'hours'
  }],
  // 对日期分类编辑信息
  dateTypeArray: [{
    text: '单个日期',
    tag: 'single'
  }, {
    text: '日期范围',
    tag: 'multiple'
  }]
}

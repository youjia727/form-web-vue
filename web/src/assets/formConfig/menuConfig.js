//左侧菜单栏点击选择组件
export const titleListComponent = [{
  config: {
    label: '填空题',
    tag_label: '单行填空',
    title_img_url: '',
    qs_describe: '',
    type: 'input',
    tag: 'single-input',
    required: true,
    regList: [], //验证数组
    clearable: true,
    maxlength: null
  },
  showQsDescribe: false,
  showAnswerSet: true, //是否显示考试答案设置
  answerData: [] //考试答案
}, {
  config: {
    label: '选择题',
    tag_label: '单选题',
    title_img_url: '',
    qs_describe: '',
    type: 'select',
    tag: 'radio',
    required: true,
    regList: [], //验证数组
    clearable: true
  },
  max: null, //最多选择几项
  min: null, //最少选择几项
  showQsDescribe: false,
  showAnswerSet: true, //是否显示考试答案设置
  answerData: [], //考试答案
  options: [{
    label: '',
    mark: [],
    options_id: 1,
    img_url: '',
    jump_to: [], //关联选项
    is_end: false
  }, {
    label: '',
    mark: [],
    options_id: 2,
    img_url: '',
    jump_to: [], //关联选项
    is_end: false
  }]
}, {
  config: {
    label: '多段填空',
    tag_label: '多段填空',
    title_img_url: '',
    qs_describe: '', //题目说明
    qs_detail: '填空1＿＿＿＿填空2＿＿＿＿',
    type: 'multiple-input',
    tag: 'multiple-input',
    required: true,
    regList: [], //验证数组
    clearable: true,
    maxlength: null
  },
  showQsDescribe: false,
  showAnswerSet: true, //是否显示考试答案设置
  answerData: [], //考试答案
}, {
  config: {
    label: '评分题',
    tag_label: '评分题',
    title_img_url: '',
    qs_describe: '',
    type: 'rate',
    tag: 'rate',
    required: true,
    count: 5, //评分数
    regList: [{
      pattern: '/^\\+?[1-9]\\d*$/',
      message: '此题为必答题，请先作答'
    }], //验证数组
    clearable: true,
  },
  showQsDescribe: false,
  showAnswerSet: false, //是否显示考试答案设置
  answerData: [] //考试答案
}]

// 常用的题目模板
export const commonUserComponent = [{
  config: {
    label: '姓名',
    tag_label: '单行填空',
    title_img_url: '',
    qs_describe: '',
    type: 'input',
    tag: 'single-input',
    required: true,
    regList: [{
      pattern: '/^[\u4E00-\u9FA5]{1}[\u4E00-\u9FA5\·\.\-]{0,8}[\u4E00-\u9FA5]{1}$/',
      message: '请输入正确的姓名'
    }], //验证数组
    clearable: true,
    maxlength: 15
  },
  showQsDescribe: false,
  showAnswerSet: true, //是否显示考试答案设置
  answerData: [] //考试答案
}, {
  config: {
    label: '手机号',
    tag_label: '单行填空',
    title_img_url: '',
    qs_describe: '',
    type: 'input',
    tag: 'single-input',
    required: true,
    regList: [{
      pattern: '/^1(3|4|5|7|8|9)\d{9}$/',
      message: '请输入正确的手机号'
    }], //验证数组
    clearable: true,
    maxlength: 11
  },
  showQsDescribe: false,
  showAssociateBtn: false, //是否显示关联题目的操作按钮
  showAnswerSet: true, //是否显示考试答案设置
  answerData: [] //考试答案
}, {
  config: {
    label: '性别',
    tag_label: '单选题',
    title_img_url: '',
    qs_describe: '',
    type: 'select',
    tag: 'radio',
    required: true,
    regList: [], //验证数组
    clearable: true
  },
  showQsDescribe: false,
  showAnswerSet: true, //是否显示考试答案设置
  answerData: [], //考试答案
  options: [{
    label: '男',
    mark: [],
    options_id: 1,
    img_url: '',
    jump_to: [], //关联选项
    is_end: false
  }, {
    label: '女',
    mark: [],
    options_id: 2,
    img_url: '',
    jump_to: [], //关联选项
    is_end: false
  }]
}, {
  config: {
    label: '日期',
    tag_label: '单个日期',
    title_img_url: '',
    qs_describe: '',
    type: 'date',
    tag: 'single-day',
    required: true,
    regList: [], //验证数组
    clearable: true
  },
  showQsDescribe: false,
  showAnswerSet: false, //是否显示考试答案设置
  answerData: [] //考试答案
}, {
  config: {
    label: '邮箱',
    tag_label: '单行填空',
    title_img_url: '',
    qs_describe: '',
    type: 'input',
    tag: 'single-input',
    required: true,
    regList: [{
      pattern: '/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/',
      message: '请输入正确的邮箱'
    }], //验证数组
    clearable: true,
    maxlength: 52
  },
  showQsDescribe: false,
  showAnswerSet: true, //是否显示考试答案设置
  answerData: [] //考试答案
}, {
  config: {
    label: '地址',
    tag_label: '地址',
    title_img_url: '',
    qs_describe: '',
    type: 'area',
    tag: 'county', //province,city,county,address
    required: true,
    regList: [], //验证数组
    clearable: true,
    maxlength: null
  },
  showQsDescribe: false,
  showAnswerSet: false, //是否显示考试答案设置
  answerData: [] //考试答案
}]

// 考试模板题型
export const examComponent = [{
  config: {
    label: '考试单选',
    tag_label: '单选题',
    title_img_url: '',
    qs_describe: '',
    type: 'select',
    tag: 'radio',
    required: false,
    regList: [], //验证数组
    clearable: true
  },
  score: 5,//分数
  showQsDescribe: false,
  showAnswerSet: true, //是否显示考试答案设置
  answerData: [], //考试答案
  options: [{
    label: '',
    mark: [],
    options_id: 1,
    img_url: '',
    jump_to: [], //关联选项
    is_end: false
  }, {
    label: '',
    mark: [],
    options_id: 2,
    img_url: '',
    jump_to: [], //关联选项
    is_end: false
  }]
}, {
  config: {
    label: '考试多选',
    tag_label: '多选题',
    title_img_url: '',
    qs_describe: '',
    type: 'select',
    tag: 'checkbox',
    required: false,
    regList: [], //验证数组
    clearable: true
  },
  score: 5,//分数
  showQsDescribe: false,
  showAnswerSet: true, //是否显示考试答案设置
  answerData: [], //考试答案
  options: [{
    label: '',
    mark: [],
    options_id: 1,
    img_url: '',
    jump_to: [], //关联选项
    is_end: false
  }, {
    label: '',
    mark: [],
    options_id: 2,
    img_url: '',
    jump_to: [], //关联选项
    is_end: false
  }]
}, {
  config: {
    label: '考试判断',
    tag_label: '单选题',
    title_img_url: '',
    qs_describe: '',
    type: 'select',
    tag: 'radio',
    required: false,
    regList: [], //验证数组
    clearable: true
  },
  score: 5,//分数
  showQsDescribe: false,
  showAnswerSet: true, //是否显示考试答案设置
  answerData: [], //考试答案
  options: [{
    label: '对',
    mark: [],
    options_id: 1,
    img_url: '',
    jump_to: [], //关联选项
    is_end: false
  }, {
    label: '错',
    mark: [],
    options_id: 2,
    img_url: '',
    jump_to: [], //关联选项
    is_end: false
  }]
}, {
  config: {
    label: '考试填空',
    tag_label: '单行填空',
    title_img_url: '',
    qs_describe: '',
    type: 'input',
    tag: 'single-input',
    required: false,
    regList: [], //验证数组
    clearable: true,
    maxlength: null
  },
  score: 5,//分数
  showQsDescribe: false,
  showAnswerSet: true, //是否显示考试答案设置
  answerData: [] //考试答案
}, {
  config: {
    label: '多段填空',
    tag_label: '多段填空',
    title_img_url: '',
    qs_describe: '', //题目说明
    qs_detail: '填空1＿＿＿＿填空2＿＿＿＿',
    type: 'multiple-input',
    tag: 'multiple-input',
    required: false,
    regList: [], //验证数组
    clearable: true,
    maxlength: null
  },
  score: 5,//分数
  showQsDescribe: false,
  showAnswerSet: true, //是否显示考试答案设置
  answerData: [], //考试答案
}, {
  config: {
    label: '考试简答',
    tag_label: '多行填空',
    title_img_url: '',
    qs_describe: '',
    type: 'input',
    tag: 'textarea',
    required: false,
    regList: [], //验证数组
    clearable: true,
    maxlength: null
  },
  score: 5,//分数
  showQsDescribe: false,
  showAnswerSet: true, //是否显示考试答案设置
  answerData: [] //考试答案
}]

<template>
	<div class="preview-index" @click.stop="stop">
		<el-scrollbar class="preview-scroll">
			<div class="preview-form-header">
				<p class="preview-form-title">{{title}}</p>
				<p class="preview-describe" v-if="describeContent.content" :style="{'text-align': describeContent.justify_type}">{{describeContent.content}}</p>
				<p class="describe-img" v-if="describeContent.img_url"><img :src="describeContent.img_url" /></p>
			</div>
			<div class="preview-form-content">
				<a-form-model :layout="'vertical'" :model="form" :rules="rules" ref="ruleForm">
					<div class="list" v-for="(item,idx) in drawList" :key="item.formId">
						<div class="item">
							<a-form-model-item :class="[item.config.tag === 'single-input' || item.config.tag === 'dropdown' ? 'signle-input' :(item.config.tag === 'multiple-input' ? 'multiple-input' :'')]"
							 :prop="`${item.vModel}.value`" :rules="item.config.regList">
								<!-- 标题部分数据显示 -->
								<div class="item-title-box">
									<sup class="require-nbsp" v-if="item.config.required">*</sup>
									<p class="title">
										<span>{{(idx + 1 + '. ') + item.config.label}}</span>
										<span class="check-notice" v-if="item.config.tag === 'checkbox' && (item.max || item.min)">
											【{{item.max === item.min ? '本题只能选择' + item.min + '项' : (item.max && item.min ? '此题最少选择 ' + item.min + ' 项，最多选择 ' + item.max + ' 项' : (item.max ? '此题最多选择 ' + item.max + ' 项' : '此题最少选择 ' + item.min + ' 项'))}}】
										</span>
									</p>
									<p v-if="item.config.qs_describe.length" class="preview-describe">{{item.config.qs_describe}}</p>
									<p v-if="item.config.title_img_url" class="title-img-box"><img :src="item.config.title_img_url" alt="标题图片" />
									</p>
								</div>

								<!-- 单行文本 -->
								<template v-if="item.config.tag === 'single-input'">
									<a-input :max-length="item.config.maxlength" v-model="form[item.vModel].value" placeholder="请输入" />
								</template>

								<!-- 多行文本 -->
								<template v-if="item.config.tag === 'textarea'">
									<a-textarea :max-length="item.config.maxlength" v-model="form[item.vModel].value" placeholder="请输入" :auto-size="{ minRows: 4 }" />
								</template>

								<!-- 单选题 -->
								<template v-if="item.config.tag === 'radio'">
									<a-radio-group v-model="form[item.vModel].value">
										<div class="item-option-select" v-for="(optionItem,optionIdx) in item.options" :key="'optionItem' + optionIdx">
											<a-radio @click="radioClick(item.vModel,item.options,optionIdx)" @change="radioChange($event,item.options,optionIdx,idx)"
											 v-if="!optionItem.set_other" :value="optionItem.label + '|||' + optionItem.img_url + '|||' + optionItem.options_id">
												<span v-if="optionItem.label.length">{{optionItem.label}}</span>
												<img :style="{'margin-top': optionItem.label.length ? '10px' : 0}" class="preview-option-img" v-if="optionItem.img_url"
												 :src="optionItem.img_url" alt="选项图片" />
											</a-radio>
											<a-radio @click="radioClick(item.vModel,item.options,optionIdx)" @change="radioChange($event,item.options,optionIdx,idx)"
											 class="other-select" v-else :value="'其他'">
												<span>其他</span>
												<a-textarea auto-size v-show="form[item.vModel].value === '其他'" v-model="form[item.vModel].other_input"
												 placeholder="请输入" class="more-input" />
											</a-radio>
										</div>
									</a-radio-group>
								</template>

								<!-- 多选题 -->
								<template v-if="item.config.tag === 'checkbox'">
									<a-checkbox-group v-model="form[item.vModel].value" @change="checkBoxChange($event,item.options,idx)">
										<div class="item-option-select" v-for="(optionItem,optionIdx) in item.options" :key="'optionItem' + optionIdx">
											<a-checkbox v-if="!optionItem.set_other" :value="optionItem.label + '|||' + optionItem.img_url + '|||' + optionItem.options_id">
												<span v-if="optionItem.label.length">{{optionItem.label}}</span>
												<img class="preview-option-img" v-if="optionItem.img_url" :src="optionItem.img_url" alt="选项图片" />
											</a-checkbox>
											<a-checkbox class="other-select" v-else :value="'其他'">
												<span>其他</span>
												<a-textarea auto-size v-show="form[item.vModel].value.includes('其他')" v-model="form[item.vModel].other_input"
												 placeholder="请输入" class="more-input" />
											</a-checkbox>
										</div>
									</a-checkbox-group>
								</template>

								<!-- 下拉题 -->
								<template v-if="item.config.tag === 'dropdown'">
									<a-select @change="dropDownChange($event,item.options,idx)" placeholder="请选择" allowClear v-model="form[item.vModel].value"
									 style="width: 100%">
										<a-icon slot="suffixIcon" type="caret-down" />
										<a-select-option v-for="(optionItem,optionIdx) in item.options" :key="'optionItem' + optionIdx" :value="optionItem.set_other ? '其他' : optionItem.label + '|||' + optionItem.options_id">
											{{optionItem.set_other ? '其他' : optionItem.label}}
										</a-select-option>
									</a-select>
									<a-textarea auto-size v-show="form[item.vModel].value === '其他'" v-model="form[item.vModel].other_input" style="margin-top: 6px;"
									 placeholder="请输入" />
								</template>

								<!-- 多段填空题 -->
								<template v-if="item.config.tag === 'multiple-input'">
									<div class="multiple-input-content">
										<li class="multiple-input-item" v-for="(inputItem,inputIdx) in filterMultipleInput(item.config.qs_detail)"
										 :key="'inputItem' + inputIdx">
											<span class="qs_info">{{inputItem.text}}</span>
											<a-input :style="{width:text(form[item.vModel].value[inputIdx])}" v-if="inputItem.is_show_input" v-model="form[item.vModel].value[inputIdx]"
											 placeholder="请输入" />
										</li>
									</div>
								</template>

								<!-- 评分题 -->
								<template v-if="item.config.tag === 'rate'">
									<a-rate v-model="form[item.vModel].value" :count="item.config.count"></a-rate>
								</template>

								<!-- 日期选择题 -->
								<template v-if="item.config.type === 'date'">
									<div class="date-box-item" v-if="item.config.tag.includes('single')">
										<a-icon type="calendar" style="font-size: 16px;" />
										<a-month-picker :showToday="false" class="date-pick-width" suffix-icon=" " v-if="item.config.tag.includes('month')"
										 v-model="form[item.vModel].value" format="YYYY-MM" valueFormat="YYYY-MM" placeholder="请选择日期"></a-month-picker>
										<a-date-picker :showToday="false" class="date-pick-width" suffix-icon=" " v-if="item.config.tag.includes('day')"
										 v-model="form[item.vModel].value" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" placeholder="请选择日期"></a-date-picker>
										<a-date-picker show-time :locale="locale" :showToday="false" class="date-pick-width" suffix-icon=" " v-if="item.config.tag.includes('hours')"
										 v-model="form[item.vModel].value" format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss" placeholder="请选择日期"></a-date-picker>
									</div>
									<div class="date-box-item" v-if="item.config.tag.includes('multiple')">
										<a-icon type="schedule" style="font-size: 16px;" />
										<a-range-picker :showToday="false" :placeholder="['开始日期', '结束日期']" class="date-pick-width" suffix-icon=" "
										 v-if="item.config.tag.includes('month')" v-model="form[item.vModel].value" format="YYYY-MM" valueFormat="YYYY-MM"></a-range-picker>
										<a-range-picker :showToday="false" :placeholder="['开始日期', '结束日期']" class="date-pick-width" suffix-icon=" "
										 v-if="item.config.tag.includes('day')" v-model="form[item.vModel].value" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD"></a-range-picker>
										<a-range-picker show-time :locale="locale" :showToday="false" :placeholder="['开始日期', '结束日期']" class="date-pick-width"
										 suffix-icon=" " v-if="item.config.tag.includes('hours')" v-model="form[item.vModel].value" format="YYYY-MM-DD HH:mm"
										 valueFormat="YYYY-MM-DD HH:mm"></a-range-picker>
									</div>
								</template>

								<!-- 省市区地区 -->
								<template v-if="item.config.type === 'area'">
									<div class="area-box">
										<div class="select-area">
											<a-select @change="areaChange($event,'省',item.vModel)" placeholder="省/自治区/直辖市" allowClear v-model="form[item.vModel].value[0]"
											 class="area-select-item">
												<a-icon slot="suffixIcon" type="caret-down" />
												<a-select-option v-for="(optionItem,optionIdx) in areaList.province_list" :key="'optionItem' + optionIdx"
												 :value="optionItem">
													{{optionItem}}
												</a-select-option>
											</a-select>
											<a-select @change="areaChange($event,'市',item.vModel)" v-if="areaShowCallBack(2,item.config.tag)"
											 placeholder="市" allowClear v-model="form[item.vModel].value[1]" class="area-select-item">
												<a-icon slot="suffixIcon" type="caret-down" />
												<template v-if="form[item.vModel].value[0]">
													<a-select-option v-for="(optionItem,optionIdx) in areaListCallBack(form[item.vModel].value[0],'市')" :key="'optionItem' + optionIdx"
													 :value="optionItem">
														{{optionItem}}
													</a-select-option>
												</template>
												<template v-else>
													<a-select-option :value="undefined">市</a-select-option>
												</template>
											</a-select>
											<a-select @change="areaChange($event,'区县',item.vModel)" v-if="areaShowCallBack(3,item.config.tag)"
											 placeholder="区/县" allowClear v-model="form[item.vModel].value[2]" class="area-select-item">
												<a-icon slot="suffixIcon" type="caret-down" />
												<template v-if="form[item.vModel].value[1]">
													<a-select-option v-for="(optionItem,optionIdx) in areaListCallBack(form[item.vModel].value[1],'区县')" :key="'optionItem' + optionIdx"
													 :value="optionItem">
														{{optionItem}}
													</a-select-option>
												</template>
												<template v-else>
													<a-select-option :value="undefined">区/县</a-select-option>
												</template>
											</a-select>
										</div>
										<div v-if="areaShowCallBack(4,item.config.tag)" class="detail-address">
											<a-textarea auto-size class="local-input" :max-length="100" v-model="form[item.vModel].value[3]" placeholder="详细地址">
											</a-textarea>
											<a-icon slot="suffix" type="environment" />
										</div>
									</div>
								</template>
							</a-form-model-item>
						</div>
					</div>
					<a-form-model-item style="text-align: center;margin-top: 60px;">
						<a-button @click="resetForm">重置</a-button>
						<a-button type="primary" style="margin-left: 20px;" @click="onSubmit">提交</a-button>
					</a-form-model-item>
				</a-form-model>
			</div>
		</el-scrollbar>
	</div>
</template>

<script>
	import moment from 'moment';
	import 'moment/locale/zh-cn';
	import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
	import {
		areaList
	} from '@vant/area-data';

	export default {
		props: ['title', 'list', 'describeContent'],
		data() {
			return {
				locale,
				areaList,
				query: {},
				rules: {},
				form: {},
				// formList: [], //原form表单列表
				drawList: [], //页面显示表单列表
				contactList: [], //有关联的列表
				endList: [] //选择题直接结束后面的数据
			}
		},
		computed: {
			text() {
				return function(value) {
					if (value.length <= 7) {
						return '104px'
					} else {
						let width = 104 + (String(value).length - 7) * 14
						return width + 'px'
					}
				}
			}
		},
		created() {
			this.query = this.getRequest()
			this.initPageData(this.list)
		},
		methods: {
			//获取参数
			getRequest() {
				var url = window.location.search;
				var theRequest = new Object();
				if (url.indexOf("?") != -1) {
					var str = url.substr(1);
					var strs = str.split("&");
					for (var i = 0; i < strs.length; i++) {
						theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
					}
				}
				return theRequest;
			},
			//初始化页面显示数据源
			initPageData(arr) {
				this.drawList = JSON.parse(JSON.stringify(arr))
				this.drawList.forEach((item, index) => {
					if ('maxlength' in item.config) {
						let max_num = Number(item.config.maxlength)
						item.config.maxlength = max_num ? max_num : null
					}
					this.$set(this.drawList[index], 'index', index)
					if (!item.config.required) {
						this.$set(this.drawList[index].config, 'regList', [])
					}
				})
				arr.forEach((item, index) => {
					this.echoForm(item)
					this.buildRules(item, index)
				})
				arr.forEach((item, index) => {
					this.renderList(item, index)
				})
			},
			//动态创建form数据
			echoForm(item) {
				let formItem = {
					value: '',
					tag: item.config.tag,
					other_input: '',
					required: item.config.required
				}
				switch (item.config.tag) {
					case 'checkbox':
						formItem.value = []
						break;
					case 'dropdown':
						formItem.value = undefined
						break;
					case 'multiple-input':
						let num = item.config.qs_detail.split('＿＿＿＿').length - 1
						let arr = []
						for (let i = 0; i < num; i++) {
							arr[i] = ''
						}
						formItem.value = arr
						break;
					case 'rate':
						formItem.value = 0
						break;
				}
				if (item.config.type === 'date' && item.config.tag.includes('multiple')) {
					formItem.value = []
				}
				if (item.config.type === 'area') {
					let tagarr = ['province', 'city', 'county', 'address']
					let index = tagarr.findIndex(el => item.config.tag === el)
					let arr = []
					for (let i = 0; i < index + 1; i++) {
						arr[i] = undefined
					}
					formItem.value = arr
				}
				this.$set(this.form, item.vModel, formItem)
			},
			//动态渲染显示数据列表
			renderList(item, index) {
				if (item.options) {
					item.options.forEach(items => {
						if (items.jump_to.length) {
							items.jump_to.forEach(el => {
								let formId = el.split('-')[0]
								this.drawList.some((element, itemIdx) => {
									if (element.formId == formId) {
										this.contactList.push(element)
										this.drawList.splice(itemIdx, 1)
										return true
									}
								})
							})
						}
					})
				}
			},
			//构建校验规则
			buildRules(item, index) {
				if (item.config.required) {
					let arr = []
					let trigger = item.config.type.includes('input') ? 'blur' : 'change';
					let type = item.config.tag;
					arr.push({
						required: true,
						message: '此题为必答题，请先作答',
						trigger
					})
					if (item.config.regList.length) {
						item.config.regList.forEach((items, idx) => {
							if (items.pattern) {
								arr.push({
									required: true,
									pattern: eval(items.pattern),
									message: items.message || '此题为必答题，请先作答',
									trigger
								})
							}
						})
					}
					if (type === 'checkbox') {
						let limit = {
							max: item.max,
							min: item.min
						}
						let checkboxRule = {
							validator: (rule, value, callback) => {
								this.checkboxValidator(rule, value, callback, limit)
							},
							trigger
						}
						arr.push(checkboxRule)
					}
					if (type === 'multiple-input' || item.config.type === 'area') {
						let multipleRuleItem = {
							validator: this.multipleValidator,
							trigger
						}
						arr.push(multipleRuleItem)
					}
					this.$set(this.drawList[index].config, 'regList', arr)
				}
			},
			// 多选题限制选项
			checkboxValidator(rule, value, callback, limit) {
				if (limit.max || limit.min) {
					if (limit.max == limit.min && value.length !== limit.min) {
						return callback(new Error('此题只能选择 ' + limit.min + ' 项'));
					} else if ((limit.max && limit.min) && (value.length > limit.max || value.length < limit.min)) {
						return callback(new Error('最少选择 ' + limit.min + ' 项，最多选择 ' + limit.max + ' 项'));
					} else if ((limit.max && !limit.min) && value.length > limit.max) {
						return callback(new Error('最多选择 ' + limit.max + ' 项'));
					} else if ((!limit.max && limit.min) && value.length < limit.min) {
						return callback(new Error('最少选择 ' + limit.min + ' 项'));
					} else {
						callback();
					}
				} else {
					callback();
				}
			},
			//多段填空验证规则
			multipleValidator(rule, value, callback) {
				if (value.some(item => !item)) {
					return callback(new Error('此题为必答题，请先作答'));
				} else {
					callback();
				}
			},
			// 选择题再次点击取消选中
			radioClick(vModel, options, optionIdx) {
				let item = options[optionIdx]
				let value = this.form[vModel].value
				let optionValue = item.label + '|||' + item.img_url + '|||' + item.options_id;
				if (value === '其他' || (value && value === optionValue)) {
					this.form[vModel].value = ''
					this.form[vModel].other_input = ''
					// 组合结束的数据
					this.contactEndList()
					// 清除关联的数据
					this.clearCallBack(options)
				} else {
					this.$set(this.form[vModel], 'value', optionValue)
				}
			},
			//单选题选择
			radioChange(e, options, optionIdx, listIdx) {
				let optionItem = options[optionIdx]
				// 组合结束的数据
				this.contactEndList()

				let optionOtherList = options.filter((el, i) => optionIdx !== i)
				// 选择此选项清除其他选项关联数据显示页面
				this.clearCallBack(optionOtherList)
				//选择此项关联数据展示
				this.publicContactCallBack(optionItem, listIdx)
			},
			//关联显示页面数据的公共函数
			publicContactCallBack(item, listIdx) {
				if (item.is_end) {
					//选择此选项直接结束
					this.endList = this.drawList.splice(listIdx + 1)
					return true;
				} else if (item.jump_to.length) {
					//选择此项关联的数据显示页面
					item.jump_to.forEach(jumpItem => {
						let formId = jumpItem.split('-')[0]
						let num = jumpItem.split('.')[0].split('-')[1]
						this.contactList.some((contactItem, index) => {
							if (formId == contactItem.formId) {
								let arr = this.drawList.map(val => {
									return val.index;
								})
								this.contactFormList(arr, num - 1, contactItem)
								this.contactList.splice(index, 1)
								return true
							}
						})
					})
				}
			},
			//清除选择之外数据的递归函数
			clearCallBack(arr) {
				arr.forEach(item => {
					if (item.jump_to.length) {
						item.jump_to.forEach(jumpItem => {
							let formId = jumpItem.split('-')[0]
							this.drawList.some((el, index) => {
								if (el.formId == formId && !this.checkContact(this.drawList, formId)) {
									if (el.options) {
										this.clearCallBack(el.options)
									}
									this.echoForm(el)
									this.contactList.push(el)
									this.drawList.splice(index, 1)
									return true
								}
							})
						})
					}
				})
			},
			// 判断是否多个选择题关联一个题
			checkContact(arr, formId) {
				let selectFilterList = arr.filter(el => el.config.type === 'select')
				let moreJump = false
				selectFilterList.forEach(el => {
					let checkedValue = this.form['filed' + el.formId].value
					el.options.forEach(option => {
						if (option.jump_to.length) {
							option.jump_to.forEach(optionJumpItem => {
								let jump_id = optionJumpItem.split('-')[0]
								let label = option.label + '|||' + option.img_url + '|||' + option.options_id
								if (jump_id == formId && checkedValue.length &&
									(checkedValue.includes(label) ||
										checkedValue.includes('其他'))) {
									moreJump = true
								}
							})
						}
					})
				})
				return moreJump;
			},
			//组合form列表数据
			contactFormList(arr, num, item) {
				let insert = false
				for (let i = 0; i < arr.length; i++) {
					if (arr[i] < num && arr[i + 1] > num && i != arr.length) {
						this.drawList.splice(i + 1, 0, item)
						insert = true
						break;
					}
				}
				if (!insert) {
					this.drawList.push(item)
				}
			},
			//组合已经结束的数组
			contactEndList() {
				let cloneArr = JSON.parse(JSON.stringify(this.endList))
				this.drawList = this.drawList.concat(cloneArr)
				this.endList = []
			},
			//多选题
			checkBoxChange(checkedArray, optionsArr, listIdx) {
				// 组合结束的数据
				this.contactEndList()

				let checkedList = []
				let noCheckedList = []
				optionsArr.forEach((item, idx) => {
					let label = item.label + '|||' + item.img_url + '|||' + item.options_id
					if (checkedArray.includes(label) || checkedArray.includes('其他')) {
						//选择此项关联数据展示
						checkedList.push(item)
					} else {
						noCheckedList.push(item)
					}
				})
				if (noCheckedList.length) {
					this.clearCallBack(noCheckedList)
				}
				if (checkedList.length) {
					checkedList.forEach(item => {
						this.publicContactCallBack(item, listIdx)
					})
				}
			},
			//下拉题
			dropDownChange(value, options, idx) {
				if (value) {
					let optionItemIdx = options.findIndex((el, i) => value == (el.label ? el.label : '选项' + (i + 1)))
					this.radioChange({}, options, optionItemIdx, idx)
				} else {
					// 选择此选项清除其他选项关联数据显示页面
					this.clearCallBack(options)
				}
			},
			//筛选多段填空题
			filterMultipleInput(qsTitle) {
				let arr = []
				if (qsTitle.length) {
					let arr1 = qsTitle.split('＿＿＿＿')
					let input_num = arr1.length - 1
					arr1.forEach((item, idx) => {
						if (item || idx + 1 <= input_num) {
							let obj = {
								text: item,
								is_show_input: idx + 1 <= input_num ? true : false
							}
							arr.push(obj)
						}
					})
				}
				return arr
			},
			// 区域盒子省市区显示与隐藏
			areaShowCallBack(level, tag) {
				let tagarr = ['province', 'city', 'county', 'address']
				let index = tagarr.findIndex(el => tag === el)
				return level <= index + 1
			},
			// 省市区数据的联动列表
			areaListCallBack(cityName, type) {
				let province_list = this.areaList.province_list
				let city_list = this.areaList.city_list
				let county_list = this.areaList.county_list
				let backList = {}
				switch (type) {
					case '市':
						for (let key in province_list) {
							if (province_list[key] === cityName) {
								let provinceCode = key.slice(0, 2)
								for (let key1 in city_list) {
									let cityCode = key1.slice(0, 2)
									if (provinceCode == cityCode) {
										backList[key1] = city_list[key1]
									}
								}
								break;
							}
						}
						break;
					case '区县':
						for (let key in city_list) {
							if (city_list[key] === cityName) {
								let cityCode = key.slice(0, 4)
								for (let key1 in county_list) {
									let countyCode = key1.slice(0, 4)
									if (cityCode == countyCode) {
										backList[key1] = county_list[key1]
									}
								}
								break;
							}
						}
						break;
				}
				return backList;
			},
			// 选择省市区清除其他级的数据
			areaChange(value, type, vModel) {
				let length = this.form[vModel].value.length
				let index = 0
				switch (type) {
					case '省':
						index = 1
						break;
					case '市':
						index = 2
						break;
					default:
						index = 3
						break;
				}
				for (let i = index; i < (length === 4 ? 3 : length); i++) {
					this.$set(this.form[vModel].value, i, undefined)
				}
			},
			//提交数据
			onSubmit() {
				this.$refs.ruleForm.validate(valid => {
					if (valid) {
						console.log('submit!', this.form);
						this.$info({
							title: '提示',
							content: '预览页面不支持提交功能！',
							centered: true,
							okText: '知道了',
							onOk() {},
						})
						return false;
						let param = {
							qid: this.query.id,
							uid: this.query.uid,
							score: '',
							username: '',
							mobile: '',
							form_item: JSON.stringify(this.form)
						}
						this.$http.submit(param).then(res => {
							if (res.code === 1) {
								this.$message.success('提交成功')
							}
						})
					} else {
						this.$message.info('请先完成必答题')
						return false;
					}
				});
			},
			//重置表单
			resetForm() {
				this.$refs.ruleForm.resetFields();
				this.initPageData(this.list)
			},
			//关闭页面
			close() {
				this.$emit('close', false)
			},
			stop(e) {}
		},
	}
</script>

<style scoped="scoped" lang="less">
	.preview-scroll {
		height: calc(100vh - 56px);

		.preview-form-header {
			width: 800px;
			margin: 0 auto;
			padding: 40px 40px 0;
			box-sizing: border-box;
			text-align: center;
			background-color: #fff;

			.preview-describe {
				padding-bottom: 20px;
				margin-bottom: 0;
			}

			.preview-form-title {
				min-height: 26px;
				line-height: 26px;
				padding-bottom: 48px;
				margin-bottom: 0;
				font-size: 20px;
				font-weight: 700;
				color: #3d4757;
			}

			.describe-img {
				margin-bottom: 0;

				img {
					height: 276px;
					width: auto;
					max-width: 80%;
				}
			}
		}

		.preview-form-content {
			width: 800px;
			margin: 0 auto;
			padding: 40px 40px 20px;
			box-sizing: border-box;
			background-color: #fff;
		}

		.date-pick-width {
			width: calc(100% - 20px) !important;
		}

		.area-box {
			.select-area {
				.area-select-item {
					width: 32%;
					margin-right: 10px;

					&:last-of-type {
						margin-right: 0;
					}
				}
			}

			.detail-address {
				display: flex;
				position: relative;
				margin-top: 5px;

				i {
					position: absolute;
					top: 14px;
					right: 2px;
					color: #aaa;
				}
			}
		}
	}

	.check-notice {
		font-size: 14px;
		color: #666;
		font-weight: normal;
	}
</style>

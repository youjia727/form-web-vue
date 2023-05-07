// 导入模块
const fs = require('fs')
const path = require('path')

const user = path.join(__dirname, './data/user.json')
const list = path.join(__dirname, './data/list.json')
const commonList = path.join(__dirname,'./data/commonList.json')
const tag = path.join(__dirname,'./data/tag.json')


// 获取用户信息
function getUser() {
	const users = JSON.parse(fs.readFileSync(user, 'utf-8'))
	return users
}

// 获取表单列表
function getFormList() {
	const lists = JSON.parse(fs.readFileSync(list, 'utf-8'))
	return lists
}

// 获取常用题列表信息
function getCommonList() {
	const commonLists = JSON.parse(fs.readFileSync(commonList, 'utf-8'))
	return commonLists
}

// 获取常用题列表信息
function getTag() {
	const tagList = JSON.parse(fs.readFileSync(tag, 'utf-8'))
	return tagList
}

module.exports = {
	// 获取标签列表
	getTag,
	
	// 获取用户信息
	getUser,
	
	// 获取表单列表
	getList({ page_size = 1, per_page = 10, userId }) {
		let newList = []
		let count = 0
		if (getFormList().length) {
			let filterArr = getFormList().filter(item => {
				return !item.isDelate && item.userId == userId
			})
			count = filterArr.length
			newList = filterArr.slice((page_size - 1) * per_page, page_size * per_page)
		}
		let formList = []
		newList.forEach(item=> {
			let formItem = {
				qid: item.qid,
				name: item.name,
				start_time: item.start_time,
				end_time: item.end_time,
				status: JSON.parse(item.publish)
			}
			formList.push(formItem)
		})
		let data = {
			count,
			formList
		}
		return data;
	},
	
	// 回收站的表单
	getTrashList({ page_size = 1, per_page = 10, userId }) {
		let newList = []
		let count = 0
		if (getFormList().length) {
			let filterArr = getFormList().filter(item => {
				return item.isDelate && item.userId == userId
			})
			count = filterArr.length
			newList = filterArr.slice((page_size - 1) * per_page, page_size * per_page)
		}
		let formList = []
		newList.forEach(item=>{
			let formItem = {
				qid: item.qid,
				name: item.name,
				start_time: item.start_time,
				end_time: item.end_time
			}
			formList.push(formItem)
		})
		let data = {
			count,
			formList
		}
		return data;
	},
	
	
	// 修改表单状态
	editStatus(data) {
		let formList = getFormList()
		let bool = false;
		if (data.userId && data.qid && 'publish' in data) {
			bool = formList.some(item => {
				if (item.userId == data.userId && item.qid == data.qid) {
					item.publish = data.publish
					return true;
				}
			})
		}
		// 保存回去
		if (bool && !fs.writeFileSync(list, JSON.stringify(formList))) {
			return true
		} else {
			return false
		}
	},
	
	// 保存表单数据
	formSave(data) {
		let formList = getFormList()
		if ('qid' in data && data.qid) {
			formList.some((item, idx) => {
				if (item.qid == data.qid && item.userId == data.userId) {
					formList.splice(idx, 1, data)
					return true
				}
			})
		} else {
			let item = data;
			item.qid = formList.length + 1 + '';
			item.isDelate = false;
			formList.unshift(item)
		}
		// 保存回去
		if (!fs.writeFileSync(list, JSON.stringify(formList))) {
			return formList[0].qid
		} else {
			return false
		}
	},
	
	// 删除表单
	formDelete({ qid, userId }) {
		let formList = getFormList()
		formList.some((item, idx) => {
			if (item.qid == qid && item.userId == userId) {
				item.isDelate = true
				return true
			}
		})
		if (!fs.writeFileSync(list, JSON.stringify(formList))) {
			return true
		} else {
			return false
		}
	},
	
	// 彻底删除表单
	trashDelete({ qid, userId }) {
		let formList = getFormList()
		formList.some((item, idx) => {
			if (item.qid == qid && item.userId == userId) {
				formList.splice(idx, 1)
				return true
			}
		})
		if (!fs.writeFileSync(list, JSON.stringify(formList))) {
			return true
		} else {
			return false
		}
	},
	
	// 数据还原
	trashReset({ qid, userId }) {
		let formList = getFormList()
		formList.some((item, idx) => {
			if (item.qid == qid && item.userId == userId) {
				item.isDelate = false
				return true
			}
		})
		if (!fs.writeFileSync(list, JSON.stringify(formList))) {
			return true
		} else {
			return false
		}
	},
	
	// 获取表单详情
	getDetail({ qid, userId }) {
		let itemDetail =  getFormList().find(item => {
			return !item.isDelate && item.userId == userId && item.qid == qid
		})
		return itemDetail;
	},
	
	// 获取常用题列表
	getCommonData({ userId }) {
		let common_list = getCommonList()
		let filterArr = common_list.filter(item=>{
			return item.userId == userId
		})
		return filterArr
	},
	
	// 增加常用题
	addCommonItem(data) {
		let common_list = getCommonList()
		if ('id' in data && data.id) {
			let currentArr = []
			common_list.some((item, idx) => {
				if (item.id == data.id) {
					Object.assign(item, data)
					currentArr.push(item)
					common_list.splice(idx, 1)
					return true
				}
			})
			common_list = currentArr.concat(common_list)
		} else {
			let item = data;
			item.id = common_list.length + 1 + '';
			item.isDelate = false;
			common_list.unshift(item)
		}
		// 保存回去
		if (!fs.writeFileSync(commonList, JSON.stringify(common_list))) {
			return true
		} else {
			return false
		}
	},
	
	// 删除常用题
	delCommonItem(id) {
		let common_list = getCommonList()
		if (!id) return;
		common_list.some((item, idx) => {
			if (item.id == id) {
				common_list.splice(idx, 1)
				return true;
			}
		})
		// 保存回去
		if (!fs.writeFileSync(commonList, JSON.stringify(common_list))) {
			return true
		} else {
			return false
		}
	},
	

	// 获取管理员用户列表
	getAdminList({
		page_index,
		page_size
	}) {
		const users = JSON.parse(fs.readFileSync(userInfo, 'utf-8'))
		const total = users.length
		let pages = 1
		let pageSize = 5
		if (page_index) {
			pages = page_index
		}
		if (page_size) {
			pageSize = page_size
		}
		 var newList =  users.filter(item => {
			return !item.isDelate
		})
		newList.slice(pages * pageSize, (pages + 1) * pageSize)
		return obj = {
			total: total,
			usersList: newList
		}
	},

	// 获取英雄列表
	getHeroList({
		keywords,
		page_index,
		page_size
	}) {
		const heroList = getAllHero()
		const total = heroList.length
		let pages = 1
		let pageSize = 6
		if (page_index) {
			pages = page_index
		}
		if (page_size) {
			pageSize = page_size
		}
		let arr = []
		if (keywords) {
			heroList.forEach(item => {
				if (item.name.includes(keywords)) {
					arr.push(item)
				}
			})
		} else {
			var newList =  heroList.filter(item => {
				return !item.isDelate
			})
			arr = newList
		}
		arr.slice(pages * pageSize, (pages + 1) * pageSize)

		return obj = {
			total: total,
			heroList: arr
		}
	},

	//增加英雄
	addHero({
		name,
		avatar,
		skill_info,
		isDelate,
		id

	}) {
		const heroList = getAllHero()
		if (id) {
			heroList.some(item => {
				if (item.id === id) {
					item.name = name
					item.avatar = avatar
					item.skill_info = skill_info
					return true
				}
			})
		} else {
			heroList.push({
				id: heroList.length + 1,
				name,
				avatar,
				skill_info,
				isDelate
			})
		}
		// 保存回去
		if (!fs.writeFileSync(heroInfo, JSON.stringify(heroList))) {
			return true
		} else {
			return false
		}
	},

	//删除英雄
	delHero({
		id
	}) {
		const heroList = getAllHero()
		heroList.some(item => {
			if (item.id === id) {
				item.isDelate = true
				return true
			}
		})
		// 保存回去
		if (!fs.writeFileSync(heroInfo, JSON.stringify(heroList))) {
			return true
		} else {
			return false
		}
	},

	//增加管理员
	add_adminstor(params) {
		const List = getUser()
		if (params.id) {
			List.some(item => {
				if (item.id === params.id) {
					Object.assign(item,params)
					return true
				}
			})
		} else {
			params.id = List.length + 1,
			List.push(params)
		}
		// 保存回去
		if (!fs.writeFileSync(userInfo, JSON.stringify(List))) {
			return true
		} else {
			return false
		}
	},
	//删除管理员
	delAdminstor({
		id
	}) {
		const List = getUser()
		List.some(item => {
			if (item.id == id) {
				item.isDelate = true
				return true
			}
		})
		// 保存回去
		if (!fs.writeFileSync(userInfo, JSON.stringify(List))) {
			return true
		} else {
			return false
		}
	},
}

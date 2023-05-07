<template>
	<div class="login-index">
		<div class="login-form-box">
			<h4>表单设计系统</h4>
			<a-form-model ref="ruleForm" :model="form" :rules="rule" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
				<a-form-model-item prop="name">
					<a-input v-model.trim="form.name" placeholder="请输入用户名">
						<a-icon slot="prefix" type="user" />
					</a-input>
				</a-form-model-item>
				<a-form-model-item prop="password">
					<a-input type="password" v-model.trim="form.password" placeholder="请输入密码">
						<a-icon slot="prefix" type="unlock" />
					</a-input>
				</a-form-model-item>
				<a-form-model-item>
					<div v-if="isShow">
						<a-popover placement="top" v-model="visible" title="滑动方块进行验证" width="300" trigger="click">
							<template slot="content">
								<div class="valid-img-box">
									<slide-verify :l="42" :r="10" :w="300" :h="150" @success="onSuccess" @fail="onFail" slider-text="向右滑动"></slide-verify>
									<transition name="el-zoom-in-bottom">
										<p v-if="isError==='error'" class="error">验证失败，请正确拼合图像</p>
										<p v-if="isError==='success'" class="success">验证成功</p>
									</transition>
								</div>
							</template>
							<a-button :class="['valid-btn',isVisible?'sure':'']" style="width: 100%;">
								<a-icon :type="isVisible?'check-circle':'exclamation-circle'" />
								{{visibleText}}
							</a-button>
						</a-popover>
					</div>
					<a-button v-else :class="['valid-btn',isVisible?'sure':'']" style="width: 100%;">
						<a-icon :type="isVisible?'check-circle':'exclamation-circle'" />
						{{visibleText}}
					</a-button>
				</a-form-model-item>
				<a-form-model-item :wrapper-col="{ span: 24}" class="login-btn-box">
					<a-button class="login-btn" type="primary" @click="onSubmit">登 录</a-button>
					<!-- <a-button class="login-btn" @click="sendMessageToServer">发 送</a-button> -->
				</a-form-model-item>
			</a-form-model>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					name: '',
					password: ''
				},
				isVisible: false,
				visible: false,
				isError: false,
				isShow: true,
				visibleText: '点击按钮进行验证',
				rule: {
					name: [{
						required: true,
						min: 1,
						message: '请输入用户名',
						trigger: 'change'
					}],
					password: [{
						required: true,
						min: 1,
						message: '请输入密码',
						trigger: 'change'
					}]
				}
			}
		},
		mounted() {
			// console.log('11111',this.$socket)
			// this.$socket.emit('connect', 'loginId');//触发socket连接
		},
		methods: {
			sendMessageToServer() {
				this.$socket.emit('verify', '111111111111');
			},
			onSubmit() {
				this.$refs.ruleForm.validate(valid => {
					if (valid) {
						let param = {
							username: this.form.name,
							password: this.form.password
						}
						this.$http.login(param).then(res => {
							if (res.code === 0) {
								this.$router.push('/form')
								sessionStorage.setItem('FORM-USER-LOGIN', res.data.value)
								sessionStorage.setItem('FORM-TOKEN', res.data.token)
								this.$message.success('登录成功')
							}
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//图片验证成功
			onSuccess() {
				//成功后的逻辑代码
				this.visibleText = '验证成功!';
				this.isError = 'success'
				this.isVisible = true;
				setTimeout(() => {
					this.isError = false
					this.visible = false
					this.isShow = false
				}, 1000)
			},
			//验证失败
			onFail() {
				this.isError = 'error'
				setTimeout(() => {
					this.isError = false
				}, 2000)
				//失败后的逻辑代码
			},
		},
	}
</script>

<style scoped lang="less">
	.login-index {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100vh;
		margin: 0 auto;
		background: url('../../../static/image/login_bgc.png') no-repeat center center;
		background-size: 100% 100%;
		background-attachment: fixed;

		.login-form-box {
			position: absolute;
			top: calc(50% - 150px);
			right: 18%;
			width: 30%;
			height: 300px;
			padding: 25px;
			box-sizing: border-box;
			border-radius: 5px;
			text-align: center;

			h4 {
				font-size: 20px;
				text-align: center;
				margin-bottom: 20px;
			}
		}
	}

	.login-btn-box {
		text-align: center;
		margin-bottom: 0;

		.login-btn {
			width: 50%;
		}
	}

	.valid-img-box {
		position: relative;

		.error,
		.success {
			position: absolute;
			bottom: 45px;
			left: 0;
			width: 100%;
			background-color: #FF6666;
			padding: 0 10px;
			box-sizing: border-box;
			color: #fff;
			line-height: 36px;
		}

		.success {
			background-color: rgba(66, 185, 131, 0.9);
		}
	}

	.valid-btn {
		width: 100%;
		text-align: left;
	}

	.sure {
		color: #42B983;
		border-color: rgba(66, 185, 131, 0.5);
		background-color: rgba(66, 185, 131, 0.1);
	}
</style>

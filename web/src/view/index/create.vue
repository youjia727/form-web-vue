<template>
  <div class="create">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="breadcrumb">我创建的</el-breadcrumb-item>
    </el-breadcrumb>
    <a-divider class="line" />
    <div class="table-box" v-if="formList.length">
      <a-table :locale="{emptyText: '暂无数据'}" rowKey="qid" :columns="columns" :data-source="formList" :pagination="false">
        <template slot="status" slot-scope="text, record">
          <a-switch @change="statusChange($event,record)" v-model="record.status" />
        </template>
        <template slot="action" slot-scope="text, record">
          <span @click="handleShare(record)" class="span form-edit" title="邀请答题"><i class="el-icon-share"></i></span>
          <span @click="handleEdit(record)" class="span form-edit" title="编辑表单"><i class="el-icon-edit-outline"></i></span>
          <!-- <span @click="handleAward(record)" class="span form-edit" title="抽奖设置"><i class="el-icon-present"></i></span> -->
          <span @click="handleDelete(record)" class="span form-delete" title="删除表单"><i class="el-icon-delete"></i></span>
        </template>
      </a-table>
      <div class="pagination">
        <a-pagination :showSizeChanger="true" :defaultCurrent="page_size" :defaultPageSize="per_page" :pageSizeOptions="['10', '15', '20']" v-model="page_size" :total="total"
          :show-total="total => `共 ${total} 条`" @showSizeChange="handleSizeChange" @change="handleCurrentChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
    </div>
    <div class="add_form_box" v-if="!formList.length">
      <a-empty image="../../../static/image/no-form.png" :image-style="{height: '100px'}">
        <span slot="description">暂无创建记录</span>
        <a-button type="primary" @click.stop="$router.push('/form/form-edit')">创建表单</a-button>
      </a-empty>
    </div>
    <div v-if="dialogShow">
      <share :title="title" :show="false" :qid="qid" :dialog="dialogShow" @close="(val)=>{dialogShow = false}"></share>
    </div>
  </div>
</template>

<script>
  import share from '../../components/share/index.vue'

  const columns = [{
      title: '标题',
      dataIndex: 'name',
      align: 'center',
      customCell: () => {
        return {
          style: {
            'min-width': '100px',
          },
        };
      }
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      align: 'center'
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      align: 'center'
    },
    {
      title: '发布状态',
      dataIndex: 'status',
      scopedSlots: {
        customRender: 'status'
      },
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: {
        customRender: 'action'
      },
      align: 'center',
      customCell: () => {
        return {
          style: {
            'min-width': '100px',
          },
        };
      }
    },
  ];

  export default {
    name:'create',
    components: {
      share
    },
    data() {
      return {
        columns,
        qid: '',
        total: 0, //总条数
        page_size: 1, //页数
        per_page: 10, //每页多少条
        formList: [],
        title: '', //分享二维码的标题
        dialogShow: false
      }
    },
    activated() {
      this.getList()
    },
	deactivated() {
		let path = this.$route.path;
		if (!path.includes('form')) {
			this.page_size = 1;
			this.per_page = 10;
		}
	},
    methods: {
      // 点击菜单栏
      onClick({ item, key, keyPath }) {
        console.log(item,key,keyPath)
      },
      //获取表单列表
      async getList() {
        let param = {
          page_size: this.page_size,
          per_page: this.per_page
        }
        let res = await this.$http.getList(param)
        if (res.code === 0) {
          this.formList = res.data.list
          this.total = res.data.count
        }
      },
      // 修改状态
      statusChange(status, row) {
        let param = {
          publish: status,
          qid: row.qid
        }
        this.$http.editPublish(param).then(res => {
          if (res.code === 0) {
            this.$message.success(res.msg)
          }
        })
      },
      //分享表单
      handleShare(row) {
        this.qid = row.qid
        this.dialogShow = true
        this.title = row.name
      },
      //编辑表单
      handleEdit(row) {
        this.$router.push({
          path: '/form/form-edit',
          query: {
            id: row.qid
          }
        })
      },
      handleAward(row) {
        this.$router.push({
          path: '/form/prize-setting',
          query: {
            qid: row.qid
          }
        })
      },
      handleDelete(row) {
        this.$confirm({
          title: '提示',
          content: '确认删除此表单问卷?',
          okText: '确定',
          okType: 'danger',
          icon: 'exclamation-circle',
          centered: true,
          cancelText: '取消',
          onOk: () => {
            this.$http.deleteform({
              qid: row.qid
            }).then(res => {
              if (res.code === 0) {
                this.getList()
                this.$message.success(res.msg)
              }
            })
          },
        });
      },
      // 修改每页多少条
      handleSizeChange(current, size) {
        this.per_page = size
        this.page_size = 1
        this.getList()
      },
      // 修改页码
      handleCurrentChange(page, pageSize) {
        this.page_size = page
        this.getList()
      }
    },
  }
</script>

<style scoped="scoped" lang="less">
  .breadcrumb {
    font-size: 16px;
  }

  .line {
    margin: 20px 0;
  }

  .span {
    display: inline-block;
    padding: 2px 6px;

    cursor: pointer;

    i {
      font-size: 16px;
    }

    &:hover {
      i {
        color: #1890FF;
        transition: 0.2s;
      }
    }
  }

  .pagination {
    padding: 20px 0;
  }

  .add_form_box {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: calc(100vh - 311px);
    justify-content: center;

    img {
      width: 100px;
      height: auto;
    }
  }
</style>

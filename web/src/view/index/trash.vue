<template>
  <div class="trash">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="breadcrumb">回收站</el-breadcrumb-item>
    </el-breadcrumb>
    <a-divider class="line" />
    <div class="table-box" v-if="formList.length">
      <a-table :locale="{emptyText: '暂无数据'}" rowKey="qid" :columns="columns" :data-source="formList" :pagination="false">
        <template slot="action" slot-scope="text, record">
          <span @click="handleReset(record)" class="span form-edit" title="还原表单">还原</span>
          <span @click="handleDelete(record)" class="span form-delete" title="彻底删除">删除</span>
        </template>
      </a-table>
      <div class="pagination">
        <a-pagination :showSizeChanger="true" :defaultCurrent="page_size" :defaultPageSize="per_page" :pageSizeOptions="['10', '15', '20']"
          v-model="page_size" :total="total" :show-total="total => `共 ${total} 条`" @showSizeChange="handleSizeChange"
          @change="handleCurrentChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
    </div>
    <div class="add_form_box" v-if="!formList.length">
      <a-empty image="../../../static/image/no-form.png" :image-style="{height: '100px'}">
        <span slot="description">暂无回收记录</span>
      </a-empty>
    </div>
  </div>
</template>

<script>
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
    name: 'trash',
    data() {
      return {
        columns,
        total: 0, //总条数
        page_size: 1, //页数
        per_page: 10, //每页多少条
        formList: []
      }
    },
    activated() {
      this.getList()
    },
	deactivated() {
		this.page_size = 1;
		this.per_page = 10;
	},
    methods: {
      //获取表单列表
      async getList() {
        let param = {
          page_size: this.page_size,
          per_page: this.per_page
        }
        let res = await this.$http.getTrashList(param)
        if (res.code === 0) {
          this.formList = res.data.list
          this.total = res.data.count
        }
      },
      // 数据还原
      handleReset(row) {
        this.$http.trashReset({
          qid: row.qid
        }).then(res => {
          if (res.code === 0) {
            this.getList()
            this.$message.success(res.msg)
          }
        })
      },
      // 数据删除
      handleDelete(row) {
        this.$confirm({
          title: '提示',
          content: '是否彻底删除此表单问卷，删除后将清空关于此表单问卷的所有信息，是否继续?',
          okText: '确定',
          okType: 'danger',
          icon: 'exclamation-circle',
          centered: true,
          cancelText: '取消',
          onOk: () => {
            this.$http.trashDelete({
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
	font-size: 12px;
	margin: 0 4px;
    padding: 4px 12px 2px;
    border: 1px solid #dedede;
    cursor: pointer;

    &:hover {
      color: #1890FF;
      border-color: #1890FF;
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

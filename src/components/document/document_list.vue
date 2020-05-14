<template>
  <div>
    <Table
      highlight-row
      :columns="columns1"
      :data="data1"
    ></Table>
    <Page
      :total="page_options.total"
      :page-size="page_options.page_size"
      :current="page_options.page"
      show-elevator
      @on-change="pageChange"
    ></Page>

    <Modal
      v-model="showEditModal"
      title="编辑文档"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <Form
        :model="editData"
        :label-width="80"
      >
        <FormItem label="ID">
          <Input
            disabled
            v-model="editData.id"
          />
        </FormItem>
        <FormItem label="Project Id">
          <Input v-model="editData.project_id" />
        </FormItem>
        <FormItem label="Text">
          <Input
            v-model="editData.text"
            type="textarea"
            :autosize="{minRows: 1,maxRows: 5}"
          />
        </FormItem>
        <FormItem label="Annotations">
          <Input
            v-model="editData.annotations"
            type="textarea"
            :autosize="{minRows: 1,maxRows: 5}"
          />
        </FormItem>
        <FormItem label="Predications">
          <Input
            v-model="editData.predications"
            type="textarea"
            :autosize="{minRows: 1,maxRows: 5}"
          />
        </FormItem>
      </Form>
    </Modal>

  </div>

</template>
<script>
const axios = require("axios");
import urlSetting from "../../setting";
export default {
  data() {
    return {
      showEditModal: false,
      columns1: [
        {
          title: "ID",
          key: "id",
          width: 100
        },
        {
          title: "Project Id",
          key: "project_id",
          width: 100
        },
        {
          title: "Text",
          key: "text"
        },
        // {
        //   title: "Annotations",
        //   key: "annotations"
        // },
        // {
        //   title: "Predications",
        //   key: "predications"
        // },
        {
          title: "操作",
          key: "action",
          width: 200,
          align: "center",
          // 编辑和删除按钮
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "default"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.editDocument(params.row);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "default"
                  },
                  on: {
                    click: () => {
                      this.doDelete(params.row);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      data1: [],
      page_options: {
        total: 100,
        page: 1,
        page_size: 10
      },
      editData: {
        id: "",
        project_id: "",
        text: "",
        annotations: "",
        predications: ""
      },
      createProjectOption: {
        isShow: false
      },
      createProjectShow: false
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    search() {
      axios
        .get(
          `${urlSetting.document_url}?project_id=${this.$route.params.id}&page=${this.page_options.page}&page_size=${this.page_options.page_size}`
        )
        .then(response => {
          console.log(response);
          if (response.status === 200) {
            this.data1 = response.data.results;
            this.page_options.total = response.data.count;
          }
        })
        .catch(error => {
          this.$Message.error(error.toString());
        })
        .then(() => {});
    },
    pageChange(page) {
      this.page_options.page = page;
      this.search();
    },

    editDocument(row) {
      axios
        .get(urlSetting.document_url + row.id + "/")
        .then(response => {
          if (response.status === 200) {
            this.editData = response.data;
          }
        })
        .catch(error => {
          this.$Message.error(error.toString());
        })
        .then(() => {});

      this.showEditModal = true;
    },
    deleteDocument(row) {
      axios
        .delete(urlSetting.document_url + row.id + "/")
        .then(response => {
          console.log(response);
          if (response.status === 204) {
            this.$Message.success("删除成功");
            this.search();
          }
        })
        .catch(error => {
          this.$Message.error(error.toString());
        })
        .then(() => {});
    },
    doDelete(row) {
      this.$Modal.confirm({
        content: `确认删除 ${row.name} ？`,
        onOk: this.deleteDocument.bind(null, row)
      });
    },
    ok() {
      this.saveDocument();
    },
    saveDocument() {
      axios
        .put(urlSetting.document_url + this.editData.id + "/", this.editData)
        .then(response => {
          if (response.status === 200) {
            this.$Message.info("保存成功");
            this.search();
          }
        })
        .catch(error => {
          this.$Message.error(error.toString());
        })
        .then(() => {});
    },
    cancel() {
      this.$Message.info("取消编辑");
    }
  }
};
</script>
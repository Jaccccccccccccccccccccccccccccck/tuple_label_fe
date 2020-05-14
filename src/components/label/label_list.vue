<template>
  <div>
    <Row>
      <Col span="1">
      <Button
        @click="showAddModal = true"
        type="success"
      >新增标签</Button>
      </Col>
    </Row>
    <Table
      highlight-row
      :columns="columns1"
      :data="data1"
    ></Table>

    <Modal
      v-model="showEditModal"
      title="编辑标签"
      @on-ok="editLabelOk"
      @on-cancel="editLabelCancel"
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
        <FormItem label="Project ID">
          <Input v-model="editData.project_id" />
        </FormItem>
        <FormItem label="Name">
          <Input v-model="editData.name" />
        </FormItem>
        <FormItem label="Shortcut">
          <Input v-model="editData.shortcut" />
        </FormItem>
        <FormItem label="Backgroud Color">
          <ColorPicker
            v-model="editData.background_color"
            size="default"
          />
        </FormItem>
        <FormItem label="Text Color">
          <ColorPicker
            v-model="editData.text_color"
            size="default"
          />
        </FormItem>

      </Form>
    </Modal>

    <Modal
      v-model="showAddModal"
      title="新增标签"
      @on-ok="addLabelOk"
      @on-cancel="addLabelCancel"
    >
      <CreateLabel ref="CreateLabel"></CreateLabel>
    </Modal>
  </div>

</template>
<script>
const axios = require("axios");
import urlSetting from "../../setting";
import CreateLabel from "./create_label";
export default {
  data() {
    return {
      showEditModal: false,
      showAddModal: false,
      queryData: {},
      columns1: [
        {
          title: "ID",
          key: "id",
          _display: false
        },
        {
          title: "Project Id",
          key: "project_id"
        },
        {
          title: "Name",
          key: "name"
        },
        {
          title: "Shortcut",
          key: "shortcut"
        },
        {
          title: "Backgroud Color",
          key: "background_color"
        },
        {
          title: "Text Color",
          key: "text_color"
        },
        {
          title: "示例",
          key: "example",
          render: (h, params) => {
            const row = params.row;
            const background_color = row.background_color;
            const text_color = text_color;
            return h(
              "Tag",
              {
                props: {
                  color: background_color
                }
              },
              row.name
            );
          }
        },
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
                      this.editLabel(params.row);
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
                      this.deleteLabel(params.row);
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
      editData: {
        id: "",
        project_id: "",
        name: "",
        shortcut: "",
        background_color: "",
        text_color: ""
      }
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    search() {
      axios
        .get(`${urlSetting.label_url}?project_id=${this.$route.params.id}`)
        .then(response => {
          console.log(response);
          if (response.status === 200) {
            this.data1 = response.data.results;
          }
        })
        .catch(error => {
          this.$Message.error(error.toString());
        })
        .then(() => {});
    },

    editLabel(row) {
      axios
        .get(urlSetting.label_url + row.id + "/")
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
    deleteProject(row) {
      axios
        .delete(urlSetting.project_url + row.id + "/")
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
        onOk: this.deleteProject.bind(null, row)
      });
    },
    editLabelOk() {
      this.saveLabel();
    },
    saveLabel() {
      axios
        .put(urlSetting.label_url + this.editData.id + "/", this.editData)
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
    editLabelCancel() {
      this.$Message.info("取消编辑");
    },
    addLabelOk() {
      this.$refs.CreateLabel.addLabel(this.search);
    },
    addLabelCancel() {
      this.$Message.info("取消添加");
    }
  },
  components: {
    CreateLabel
  }
};
</script>
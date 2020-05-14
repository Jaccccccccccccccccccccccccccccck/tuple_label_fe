<template>
  <Form
    :model="formItem"
    :label-width="100"
  >
    <FormItem label="Project Name">
      <Input
        v-model="formItem.name"
        placeholder="Enter Project Name"
      />
    </FormItem>
    <FormItem label="Description">
      <Input
        v-model="formItem.description"
        placeholder="Enter Description"
      />
    </FormItem>
  </Form>
</template>
<script>
const axios = require("axios");
import urlSetting from "../../setting";

export default {
  data() {
    return {
      formItem: {
        name: "",
        description: ""
      }
    };
  },
  methods: {
    addProject(callback) {
      axios({
        method: "post",
        url: urlSetting.project_url,
        data: this.formItem
      })
        .then(response => {
          if (response.status === 201) {
            console.log(response);
            this.$Message.success("创建成功");
          }
        })
        .catch(error => {
          this.$Message.error(error.data.message);
        })
        .then(() => {
          callback();
        });
    }
  }
};
</script>

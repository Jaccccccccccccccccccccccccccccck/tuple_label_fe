<template>
  <Form
    :model="formItem"
    :label-width="100"
  >
    <FormItem label="Project ID">
      <Input
        v-model="formItem.project_id"
        placeholder="Enter Project Id"
        disabled
      />
    </FormItem>
    <FormItem label="Label Name">
      <Input
        v-model="formItem.name"
        placeholder="Enter Label Name"
      />
    </FormItem>
    <FormItem label="Shortcut">
      <Input
        v-model="formItem.shortcut"
        placeholder="Enter Shortcut"
      />
    </FormItem>
    <FormItem label="Background Color">
      <ColorPicker
        v-model="formItem.background_color"
        size="default"
      />
    </FormItem>
    <FormItem label="Text Color">
      <ColorPicker
        v-model="formItem.text_color"
        size="default"
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
        project_id: this.$route.params.id,
        name: null,
        shortcut: null,
        background_color: "#FFFFFF",
        text_color: "#FFFFFF"
      }
    };
  },
  methods: {
    addLabel(callback) {
      axios({
        method: "post",
        url: urlSetting.label_url,
        data: this.formItem
      })
        .then(response => {
          if (response.status === 201) {
            this.$Message.success("创建成功");
          }
        })
        .catch(error => {
          this.$Message.error(error.toString());
        })
        .then(() => {
          callback();
        });
    }
  }
};
</script>

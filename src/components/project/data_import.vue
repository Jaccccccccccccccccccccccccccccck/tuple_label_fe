<template>
  <div style="background:#eee;padding: 20px">
    <Card :bordered="false">
      <p slot="title">导入数据</p>
      <p>数据格式Json,列表中只有单键text的字典</p>
      <p>eg.: <strong>[{"text": "abc"},{"text":"def"}]</strong></p>
      <Upload
        multiple
        type="drag"
        :action=project_import_url
        :data=post_data
        :on-success="handleSuccess"
        :on-error="handleError"
      >
        <div style="padding: 20px 0">
          <Icon
            type="ios-cloud-upload"
            size="52"
            style="color: #3399ff"
          ></Icon>
          <p>Click or drag files here to upload</p>
        </div>
      </Upload>

    </Card>
  </div>
</template>
<script>
import urlSetting from "../../setting";

export default {
  data() {
    return {
      project_import_url: urlSetting.project_import_url,
      post_data: {
        project_id: this.$route.params.id
      }
    };
  },
  methods: {
    handleSuccess(response) {
      console.log(response);
      this.$Message.success("上传成功 " + JSON.stringify(response));
    },
    handleError(response) {
      console.log(response);
      this.$Message.error("上传失败: Json解析出错");
    }
  }
};
</script>

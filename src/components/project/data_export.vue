<template>
  <div style="background:#eee;padding: 20px">
    <Card :bordered="false">
      <p slot="title">导出数据</p>
      <Button @click="exportProject">下载项目</Button>
    </Card>
  </div>
</template>
<script>
import urlSetting from "../../setting";
import axios from "axios";

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
    exportProject() {
      axios
        .get(
          `${urlSetting.project_export_url}?project_id=${this.$route.params.id}`,
          {
            responseType: "blob"
          }
        )
        .then(response => {
          var fileURL = window.URL.createObjectURL(new Blob([response.data]));
          var fileLink = document.createElement("a");
          fileLink.href = fileURL;
          fileLink.setAttribute(
            "download",
            `project${this.$route.params.id}.json`
          );
          document.body.appendChild(fileLink);
          fileLink.click();
        });
    }
  }
};
</script>

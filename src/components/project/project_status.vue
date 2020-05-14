<template>
  <i-circle
    :size="250"
    :trail-width="4"
    :stroke-width="5"
    :percent=this.checkStatusInfo.precent
    stroke-linecap="square"
    stroke-color="#43a3fb"
  >
    <div class="demo-Circle-custom">
      <h1>{{this.checkStatusInfo.is_checked_count}}/{{this.checkStatusInfo.total_count}}</h1>
      <p>Checked/Total</p>
      <span>
        标注进度
        <i>{{(this.checkStatusInfo.precent * 100).toFixed(6)}}%</i>
      </span>
    </div>
  </i-circle>
</template>
<script>
const axios = require("axios");
import urlSetting from "../../setting";

export default {
  data() {
    return {
      checkStatusInfo: {
        total_count: 0,
        is_checked_count: 0,
        precent: 0
      }
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    search() {
      axios
        .get(`${urlSetting.status_url}?project_id=${this.$route.params.id}`)
        .then(response => {
          console.log(response);
          if (response.status === 200) {
            console.log(response);
            this.checkStatusInfo = response.data;
          }
        })
        .catch(error => {
          this.$Message.error(error.toString());
        })
        .then(() => {});
    }
  }
};
</script>
<style lang="less">
.demo-Circle-custom {
  & h1 {
    color: #3f414d;
    font-size: 28px;
    font-weight: normal;
  }
  & p {
    color: #657180;
    font-size: 14px;
    margin: 10px 0 15px;
  }
  & span {
    display: block;
    padding-top: 15px;
    color: #657180;
    font-size: 14px;
    &:before {
      content: "";
      display: block;
      width: 50px;
      height: 1px;
      margin: 0 auto;
      background: #e0e3e6;
      position: relative;
      top: -15px;
    }
  }
  & span i {
    font-style: normal;
    color: #3f414d;
  }
}
</style>
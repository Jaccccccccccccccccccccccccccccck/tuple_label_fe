<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu
          mode="horizontal"
          theme="dark"
        >
          <div class="layout-logo">
            <img
              type="image/png"
              src="../../assets/head.png"
              width="50"
              height="40"
            >
          </div>
          <div class="layout-nav">
            <MenuItem
              name="1"
              to="/management/project_list"
            >
            <Icon type="ios-navigate"></Icon>
            项目列表
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider
          hide-trigger
          :style="{background: '#fff'}"
        >
          <Menu
            theme="light"
            width="auto"
            active-name="1"
          >
            <MenuItem
              name="1"
              :to="`/project/${this.$route.params.id}/documents`"
            >
            <Icon type="md-book" />
            数据集
            </MenuItem>
            <MenuItem
              name="2"
              :to="`/project/${this.$route.params.id}/labels`"
            >
            <Icon type="md-pricetags" />
            标签
            </MenuItem>
            <MenuItem
              name="3"
              :to="`/project/${this.$route.params.id}/status`"
            >
            <Icon type="md-analytics" />
            数据统计
            </MenuItem>
            <MenuItem
              name="4"
              :to="`/project/${this.$route.params.id}/import`"
            >
            <Icon type="ios-create" />
            数据导入
            </MenuItem>
            <MenuItem
              name="5"
              :to="`/project/${this.$route.params.id}/export`"
            >
            <Icon type="md-copy" />
            数据导出
            </MenuItem>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <!-- <Breadcrumb :style="{margin: '24px 0'}">
            <BreadcrumbItem>项目详情</BreadcrumbItem>
          </Breadcrumb> -->
          <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
            <!-- {{ $route.params.id }} -->
            <router-view></router-view>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-logo {
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
</style>
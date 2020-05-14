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
          width="380"
          :style="{background: '#fff'}"
        >
          <Menu
            :active-name=rowIndex
            theme="light"
            width="auto"
          >
            <MenuGroup title="标注文本">
              <MenuItem
                v-for="(doc, index) in data1"
                :name="index.toString()"
                :key=index
                :data-preview-id="index"
                @click.native="rowChange(index)"
              >
              <Icon
                type="ios-checkmark"
                size='30'
                color="green"
                v-show="doc.is_checked"
              />{{ doc.text.slice(0, 60) }}
              </MenuItem>

              <Page
                :total="page_options.total"
                :page-size="page_options.page_size"
                :current="page_options.page"
                show-elevator
                @on-change="pageChange"
              ></Page>
            </MenuGroup>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
            <Card>
              <div slot="title">
                <Span
                  v-for="label in labels"
                  :key="label.id"
                  :class="{fontSize: '24px'}"
                >
                  <Tag :color="label.background_color">
                    <a
                      @click="annotate(label.id)"
                      v-shortkey.once="[label.shortcut]"
                      @shortkey="annotate(label.id)"
                    >
                      {{ label.name }} - {{ label.shortcut }}
                    </a>
                  </Tag>
                </Span>
              </div>
              <div
                v-for="(chunk, index_text) in chunks"
                @click="setSelectedRange(index_text)"
                :key=index_text
              >
                <span
                  v-for="(para, index_label) in chunk"
                  :key=index_label
                  :style="{ color: para.text_color, backgroundColor: para.background_color}"
                  v-html="para.text"
                  v-on:dblclick="removeAnnotation(para.text_color, index_text, para.start_offset, para.end_offset)"
                ></span>
                <Icon
                  v-if="index_text>=1"
                  type="ios-backspace-outline"
                  color="red"
                  size='50px'
                  @click="removeAnnotationLine(index_text)"
                />
              </div>
            </Card>
            <Row>
              <!-- <Col span=6>
              <Button type="info">
                <Icon type="ios-arrow-back" />Preview
              </Button>
              </Col> -->
              <Col span=8>
              <Button
                type="warning"
                @click="uncheckAnnotation()"
              >
                <Icon type="md-close" />
                Uncheck
              </Button>
              </Col>

              <Col span=8>
              <Button
                type="primary"
                @click="addAnnotationLine()"
              >
                <Icon type="md-add" />
                Add
              </Button>
              </Col>

              <Col span=8>
              <Button
                type="success"
                @click="checkAnnotation()"
              >
                <Icon type="md-checkmark" />
                Check
              </Button>
              </Col>

            </Row>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
const axios = require("axios");
import urlSetting from "../../setting";
export default {
  data() {
    return {
      rowIndex: "0",
      documentInfo: {
        id: 0,
        text: "",
        project_id: "",
        annotations: [[]],
        is_checked: 0,
        predications: "[[]]"
      },
      page_options: {
        total: 100,
        page: 1,
        page_size: 10
      },
      selected_type: [],
      start_offset: 0,
      end_offset: 0,
      text_index: 0,
      data1: [
        { id: 0, text: "", project_id: "", annotations: [[]], is_checked: 0 } // 空集合active-name无效的解决方案
      ],
      labels: []
    };
  },
  methods: {
    rowChange(index) {
      this.rowIndex = index.toString();
      this.documentInfo = this.data1[index];
      if (typeof this.data1[index].annotations === "string") {
        this.documentInfo.annotations = JSON.parse(
          this.data1[index].annotations
        );
      } else {
        this.documentInfo.annotations = this.data1[index].annotations;
      }
    },
    pageChange(page) {
      this.page_options.page = page;
      this.query();
    },
    onCurrentChange(currentRow) {
      this.documentInfo = currentRow;
      if (typeof currentRow.annotations == "string") {
        this.documentInfo.annotations = JSON.parse(currentRow.annotations);
      } else {
        this.documentInfo.annotations = currentRow.annotations;
      }
    },
    query() {
      axios
        .get(
          `${urlSetting.document_url}?project_id=${this.$route.params.id}&page=${this.page_options.page}&page_size=${this.page_options.page_size}`
        )
        .then(response => {
          if (response.status === 200) {
            this.data1 = response.data.results;
            this.page_options.total = response.data.count;
            this.documentInfo = this.data1[0];
            this.documentInfo.annotations = JSON.parse(
              this.data1[0].annotations
            );
            this.rowIndex = "0";
          }
        })
        .catch(error => {
          this.$Message.error(error.toString());
        })
        .then(() => {});
    },
    query_label() {
      axios
        .get(`${urlSetting.label_url}?project_id=${this.$route.params.id}`)
        .then(response => {
          if (response.status === 200) {
            this.labels = response.data.results;
          }
        })
        .catch(error => {
          this.$Message.error(error.toString());
        })
        .then(() => {});
    },
    setSelectedRange(text_index) {
      const range = window.getSelection().getRangeAt(0);
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(event.target.parentElement);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      let start = preSelectionRange.toString().length;
      let end = start + range.toString().length;
      this.text_index = text_index;
      this.start_offset = start;
      this.end_offset = end;
      console.log(text_index, start, end);
    },
    validRange() {
      if (this.start_offset === this.end_offset) {
        return false;
      }
      if (
        this.start_offset > this.documentInfo.text.length ||
        this.end_offset > this.documentInfo.text.length
      ) {
        return false;
      }
      if (this.start_offset < 0 || this.end_offset < 0) {
        return false;
      }
      if (this.documentInfo.annotations.length === 0) {
        return true;
      }
      for (let e of this.documentInfo.annotations[this.text_index]) {
        if (
          e.start_offset < this.start_offset &&
          this.start_offset < e.end_offset
        ) {
          return false;
        }
        if (
          e.start_offset < this.end_offset &&
          e.end_offset > this.end_offset
        ) {
          return false;
        }
      }
      //同一个组不能出错
      return true;
    },
    validLabel(textIndex, labelId) {
      if (this.documentInfo.annotations.length === 0) {
        return true;
      }
      for (let label of this.documentInfo.annotations[textIndex]) {
        if (label.label_id == labelId) {
          return false;
        }
      }
      return true;
    },

    addAnnotationLine() {
      if (this.documentInfo.annotations.length === 0) {
        this.$Message.warning("请先标注第一个元组");
      } else if (this.documentInfo.annotations.length >= 1) {
        this.documentInfo.annotations.push([]);
        this.updateAnnotation();
      }
    },
    removeAnnotationLine(index) {
      this.documentInfo.annotations.splice(index, 1);
      this.updateAnnotation();
    },
    annotate(label_id) {
      console.log(this.validRange());
      if (!this.validLabel(this.text_index, label_id)) {
        this.$Message.warning("每行元组只且只能有一个");
        return;
      }
      if (this.validRange()) {
        if (this.documentInfo.annotations.length === 0) {
          this.documentInfo.annotations.push([]);
        }
        this.documentInfo.annotations[this.text_index].push({
          label_id: label_id,
          start_offset: this.start_offset,
          end_offset: this.end_offset
        });
        this.updateAnnotation();
      }
    },
    updateAnnotation() {
      let postData = JSON.parse(JSON.stringify(this.documentInfo));
      postData.annotations = JSON.stringify(this.documentInfo.annotations);
      axios
        .put(urlSetting.document_url + this.documentInfo.id + "/", postData)
        .then(response => {
          if (response.status === 200) {
            console.log("response ok");
          }
        })
        .catch(error => {
          this.$Message.error(error.toString());
        })
        .then(() => {});
    },
    removeAnnotation(isProcess, index1, start_offset, end_offset) {
      if (isProcess) {
        for (const [index2, annotation] of Object.entries(
          this.documentInfo.annotations[index1]
        )) {
          if (
            annotation.start_offset === start_offset &&
            annotation.end_offset === end_offset
          ) {
            this.documentInfo.annotations[index1].splice(index2, 1);
          }
        }
        this.updateAnnotation();
      }
    },
    checkAnnotation() {
      this.documentInfo.is_checked = 1;
      this.updateAnnotation();
    },
    uncheckAnnotation() {
      this.documentInfo.is_checked = 0;
      this.updateAnnotation();
    },
    getLabel(label_id) {
      for (let label of this.labels) {
        if (label.id === label_id) {
          return label;
        }
      }
    }
  },
  computed: {
    sortedEntityPositions() {
      let result = [];
      for (let annotation of this.documentInfo.annotations) {
        annotation.sort((a, b) => a.start_offset - b.start_offset);
        result.push(annotation);
      }
      return result;
    },
    chunks() {
      let sorted_annotations = this.sortedEntityPositions;
      const res = [];
      if (sorted_annotations.length === 0) {
        res.push([
          {
            text: this.documentInfo.text.slice(),
            text_color: "",
            background_color: ""
          }
        ]);
      }

      for (let annotation of sorted_annotations) {
        let tmp_list = [];
        let left = 0;
        for (let tuple of annotation) {
          if (tuple.start_offset == left) {
            tmp_list.push({
              start_offset: tuple.start_offset,
              end_offset: tuple.end_offset,
              text: this.documentInfo.text.slice(
                tuple.start_offset,
                tuple.end_offset
              ),
              text_color: this.getLabel(tuple.label_id).text_color,
              background_color: this.getLabel(tuple.label_id).background_color
            });
            left = tuple.end_offset;
          } else if (tuple.start_offset > left) {
            tmp_list.push({
              start_offset: left,
              end_offset: tuple.start_offset,
              text: this.documentInfo.text.slice(left, tuple.start_offset),
              text_color: "",
              background_color: ""
            });
            tmp_list.push({
              start_offset: tuple.start_offset,
              end_offset: tuple.end_offset,
              text: this.documentInfo.text.slice(
                tuple.start_offset,
                tuple.end_offset
              ),
              text_color: this.getLabel(tuple.label_id).text_color,
              background_color: this.getLabel(tuple.label_id).background_color
            });
            left = tuple.end_offset;
          }
        }
        if (left < this.documentInfo.text.length) {
          tmp_list.push({
            start_offset: left,
            end_offset: this.documentInfo.text.length,
            text: this.documentInfo.text.slice(left),
            text_color: "",
            background_color: ""
          });
        }
        res.push(tmp_list);
      }
      return res;
    },
    predicationsArr() {
      return JSON.parse(this.documentInfo.predications);
    }
  },
  mounted() {
    this.query_label();
    this.query();
  }
};
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
.ivu-card {
  font-size: 20px;
  line-height: 250%;
}
a {
  font-size: 18px;
}
.ivu-card-head {
  background-color: #3074e8;
}
</style>>
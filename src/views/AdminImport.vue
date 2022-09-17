<template>
  <h2 style="text-align: center">部员信息导入</h2>
  <div style="width: 40%; margin: 10px auto; border: 1px solid black; border-radius: 5px; padding: 10px">
    <el-upload
        class="upload-demo"
        ref="upload"
        accept=".xls, .xlsx"
        :file-list="fileList"
        :on-change="handleChange"
        :action="actionUrl"
        :show-file-list="true"
        :auto-upload="false"
    >
      <template #trigger>
        <el-button type="primary">选取文件</el-button>
      </template>
    </el-upload>

    <div class="segmentation" style="border-bottom: 1px solid black; margin: 10px auto"></div>
    <div class="text-red" style="font-size: 12px; margin: 10px auto">只能提交一份文件, 后提交的会覆盖之前提交的文件, 文件格式限制: .xls/.xlsx.</div>

    <el-button type="primary" @click="submit">提交</el-button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "AdminImport",
  data() {
    return {
      actionUrl: this.$store.state.host + "/admin/import",
      fileList: []
    }
  },
  methods: {
    handleChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
    },
    submit() {
      console.log(this.fileList[0]);
      let form = new FormData();
      form.append('file', this.fileList[0].raw);
      axios.post(
          this.actionUrl,
          form,
          {
            headers: {
              auth: this.$store.state.token
            }
          }
      )
          .then(res => {
            if (res.data.code !== 600) {
              window.alert("导入文件失败啦!");
            } else {
              window.alert("导入部员信息成功!");
            }
          });
    },
  }
}
</script>

<style scoped>
.text-red {
  color: orangered;
}
</style>
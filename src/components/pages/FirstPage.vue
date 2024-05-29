<template>
  <div class="firstpage">
    <h1 class="title">农云时代管理系统</h1>
    <img class="bg" src="../../assets/firstPageBg.jpg" alt="">
  </div>
</template>
<script>
export default {
  name: "firstPage",
  data() {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  margin-top: 0;
  text-align: center;
  color: rgb(50, 65, 87);
  font-size: 30px;
}
.firstpage {
  position: relative;
}
.bg{
  position: absolute;
  width: 630px;
  left: 50%;
  margin-left: -300px;
  top: 120px;
}
</style>
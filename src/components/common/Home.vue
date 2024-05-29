<template>
  <div class="hello">
    <el-container>
      <el-aside width="auto" >
        <Aside></Aside>
      </el-aside>
      <el-container>
        <el-header>
          <Header></Header>
        </el-header>
        <common-tab></common-tab>
       
          <el-main>
              <!-- 路由的出口 -->
              <router-view id="secondRoute"></router-view>
          </el-main>
        
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Aside from '@/components/common/Aside.vue'
import Header from '@/components/common/Header.vue'
import CommonTab from '@/components/common/CommonTab.vue';
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
    };
  },components:{
    Aside,
    Header,
    CommonTab
  }
};
</script>


<style scoped>
  .el-header{
    padding: 0;
  }

	/* #secondRoute:hover {
        overflow-y: overlay;
    } */
    
    #secondRoute {
        padding-right: 0px;
        padding-left: 0px;
        height: 80vh;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }


::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}
::-webkit-scrollbar-thumb { 
background-color: #1890ff;
}
::-webkit-scrollbar-track { 
  background: #ddd;
}

</style>

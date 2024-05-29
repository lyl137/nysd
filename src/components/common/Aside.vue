<template>
  <div class="asideContianer">
    <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
      :collapse="isCollapse" background-color="rgb(50, 65, 87)" text-color="#fff" active-text-color="#ffd04b">
      <h3>{{ isCollapse ? '农云' : '农云时代管理系统' }}</h3>
      <!--没有二级菜单-->
      <el-menu-item v-for="item in noChildren" :key="item.name" :index="item.name" @click="clickMenu(item)">
        <i :class="`el-icon-${item.icon}`"></i>
        <span slot="title">{{ item.label }}</span>
      </el-menu-item>
      <!--有二级菜单-->
      <el-submenu v-for="item in hasChildren" :key="item.name" :index="item.name">
        <template slot="title">
          <i :class="`el-icon-${item.icon}`"></i>
          <span slot="title">{{ item.label }}</span>
        </template>

        <el-menu-item-group v-for="subItem in item.children" :key="subItem.name">
          <el-menu-item :index="subItem.name" @click="clickMenu(subItem)">{{ subItem.label }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>
<style lang="less" scoped>
.el-menu {
  height: 100vh;
  border-right: none;

  h3 {
    color: #fff;
    text-align: center;
    line-height: 48px;
    font-size: 22px;
    font-weight: 400;
    padding: 0 20px;
  }
}
</style>

<script>
export default {
  name: "Aside",
  data() {
    return {
      //isCollapse: false,
      menuData: [
        {
          path: "/",
          name: "main",
          label: "首页",
          icon: "s-home",
          url: "Home/Home",
        },
        {
          path: "/Monitor",
          name: "monitor",
          label: "农作物监测",
          icon: "s-platform",
          url: "Monitor/monitor",
        },
        {
          label: "农作物",
          // path: "/Farm",
          icon: "view",
          name: "farm",
          // url: "Farm/farm"
          children: [
            {
              path: "/Field",
              name: "field",
              label: "农田管理",
              icon: "s-grid",
              url: "Farm/field"
            },
            {
              path: "/Crops",
              name: "crops",
              label: "农作物信息管理",
              icon: "setting",
              url: "Farm/crops"
            }
          ]
        }, {
          path: "/Order",
          name: "order",
          label: "订单管理",
          icon: "s-order",
          url: "Order/order"
        },
        {
          path: "/Ai",
          name: "ai",
          label: "在线咨询",
          icon: "service",
          url: "Ai/ai"
        }
      ]
    };
  },
  methods: {
    handleOpen(key, keyPath) {

    },
    handleClose(key, keyPath) {

    }, clickMenu(item) {
      // 如果需要更新的路由和当前路由不一致就更新
      if (this.$route.path != item.path && !(this.$route.path === '/FirstPage' && item.path === '/')) {
        this.$router.push(item.path)
      }
      // 触发面包屑数据的更新
      this.$store.commit('menuChange', item)
    }
  },
  computed: {
    hasChildren() {
      // 过滤获取所有的有二级菜单的数据
      return this.menuData.filter((item) => item.children);
    },
    noChildren() {
      // 过滤所有只有一级菜单的数据
      return this.menuData.filter((item) => !item.children);
    }, isCollapse() {
      return this.$store.state.tab.isCollapse
    }
  },
};
</script>
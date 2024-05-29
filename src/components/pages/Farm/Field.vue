<template>
    <div>
        <!-- 添加 -->
        <el-row>
            <el-button class="add" type="primary" @click="dialogFormVisible = true; field = {}">+新增农田</el-button>
        </el-row>

        <br>

        <!-- 表格start -->
        <template>
            <el-table :data="fieldData" border :max-height="tableHeight">
                <el-table-column prop="id" label="序号" width="160" header-align="center"
                    align="center"></el-table-column>
                <el-table-column prop="name" label="农田名称" width="160" header-align="center"
                    align="center"></el-table-column>
                <el-table-column prop="location" label="农田位置" width="160" header-align="center"
                    align="center"></el-table-column>
                <el-table-column prop="seedname" label="农田种植作物名称" width="160" header-align="center"
                    align="center"></el-table-column>
                <el-table-column label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="selectById(scope.row.id)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="deleteById(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <!-- 表格end -->

        <!-- 添加/编辑-新建对话框start -->
        <el-dialog title="保存农田" :visible.sync="dialogFormVisible">
            <el-form :model="field">
                <el-form-item label="农田名称" :label-width="formLabelWidth">
                    <el-input v-model="field.name" placeholder="请输入农田名称" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="农田位置" :label-width="formLabelWidth">
                    <el-input v-model="field.location" placeholder="请输入农田位置" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="种植作物名称" :label-width="formLabelWidth">
                    <el-input v-model="field.seedname" placeholder="请输入农田种植作物名称" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="ensure()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 添加-新建对话框end -->
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'field',
    data() {
        return {
            fieldData: [
                // { id: 1, name: "嗣音园", location: "李家村", seedname: "苹果" },
                // { id: 2, name: "慵饮轩", location: "王家村", seedname: "草莓" },
                // { id: 3, name: "长风院", location: "屈家村", seedname: "火龙果" },
                // { id: 4, name: "春宠居", location: "张家村", seedname: "香蕉" },
                // { id: 5, name: "系梦圃", location: "陆家村", seedname: "香梨" },
                // { id: 6, name: "拾芬田", location: "赵家村", seedname: "沃柑" },
                // { id: 7, name: "丰源", location: "何家村", seedname: "柠檬" },
                // { id: 8, name: "润田", location: "钱家村", seedname: "葡萄" },
                // { id: 9, name: "农兴源", location: "孙家村", seedname: "芒果" },
                // { id: 10, name: "绿香村", location: "周家村", seedname: "猕猴桃" },
            ],
            formLabelWidth: "120px",
            dialogFormVisible: false,
            field: {
                id: "",
                name: "",
                location: "",
                seedname: ""
            },
            tableHeight:window.innerHeight-220,
        }
    },
    methods: {

        //删除方法
        deleteById(id) {
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.delete("/field/" + id, id).then((result) => {
                    if (result.data.code == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        //重新获取表格数据
                        this.init();
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        //根据ID查询农田 -- 回显
        selectById(id) {
            this.field.id = id;
            //弹出编辑窗口
            this.dialogFormVisible = true;
            axios.get("/field/" + id).then((result) => {
                //回显到编辑表单中
                this.field = result.data.data;
            })
        },

        //确定方法
        ensure() {
            let method;
            if (this.field.id) {
                console.log("调用修改成功");
                method = this.update(this.field); // 修改
            } else {
                console.log("调用添加成功");
                method = this.add(this.field); //添加 
            }
            // 关闭新建窗口
            this.dialogFormVisible = false;

            // 清空模型数据 id=""
            this.field = {};
        },

        //修改方法
        update(field) {
            axios.put('/field', field).then((result) => {
                //console.log(result.data);
                if (result.data.code == 1) {
                    //修改成功
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    //重新获取表格数据
                    this.init();
                } else {
                    this.$message.error(result.data.msg);
                }
            })
        },

        //添加方法
        add(field) {
            axios.post('/field', field).then((result) => {
                //console.log(result.data);
                if (result.data.code == 1) {
                    //修改成功
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    });
                    //重新获取表格数据
                    this.init();
                } else {
                    this.$message.error(result.data.msg);
                }
            })
        },

        //初始化-查询全部
        init() {
            //发送异步请求，获取数据
            axios.get("/field").then((result) => {
                this.fieldData = result.data.data;
            })
        }

    },
    mounted() {
        //当页面加载完成后自动执行。
        this.init();
    },

}
</script>

<style>
.add {
    margin-left: 880px;
}
</style>
<template>
    <div>
        
        <!-- 搜索表单-start -->
        <el-form :inline="true" :model="searchCrops" class="demo-form-inline">
            <el-form-item label="农作物名称">
                <el-input v-model="searchCrops.name" placeholder="农作物名称"></el-input>
            </el-form-item>
            <el-form-item label="农作物位置">
                <el-input v-model="searchCrops.location" placeholder="农作物位置"></el-input>
            </el-form-item>
            <el-form-item label="病虫害情况">
                <el-input v-model="searchCrops.ill" placeholder="病虫害情况"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="info" @click="clear">清空</el-button>
            </el-form-item>
        </el-form>
        <!-- 搜索表单-end -->

        <!--按钮-->
        <el-row>
            <el-button type="danger" size="medium" @click="deleteByIds">- 批量删除</el-button>
            <el-button type="primary" size="medium" @click="dialogVisible = true; crops = { image: '' };">+ 新增农作物</el-button>
        </el-row>

        <!-- 生成二维码弹框 -->
        <el-dialog title="溯源二维码" :visible.sync="dialogQrleVisible" destroy-on-close="true" width="300px" center="true">
            <div id="qrcode" ref="qrCodeUrl"></div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="downs()">点击下载</el-button>
            </span>
        </el-dialog>

        <!-- 添加/编辑数据对话框表单-start -->
        <el-dialog ref="form" title="编辑农作物" :visible.sync="dialogVisible" width="40%">
            <el-form ref="form" :model="crops" label-width="90px" size="mini">
                <el-form-item label="农作物名称">
                    <el-input v-model="crops.name"></el-input>
                </el-form-item>

                <el-form-item label="农作物位置">
                    <el-input v-model="crops.location"></el-input>
                </el-form-item>

                <el-form-item label="施肥情况">
                    <el-input v-model="crops.amount"></el-input>
                </el-form-item>

                <el-form-item label="环境温度">
                    <el-input v-model="crops.temp"></el-input>
                </el-form-item>

                <el-form-item label="湿度">
                    <el-input v-model="crops.humidity"></el-input>
                </el-form-item>

                <el-form-item label="图片">
                    <el-upload class="avatar-uploader" action="upload" :headers="token" name="image"
                        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="crops.image" :src="crops.image" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item label="光照">
                    <el-input v-model="crops.light"></el-input>
                </el-form-item>

                <el-form-item label="病虫害情况">
                    <el-input v-model="crops.ill"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="ensure">提交</el-button>
                    <el-button @click="dialogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 添加数据对话框表单-end -->

        <br>

        <!-- 表格start -->
        <el-table :data="cropsData" border @selection-change="handleSelectionChange" :max-height="tableHeight">
            <el-table-column type="selection" width="55"  align="center"></el-table-column>
            <el-table-column prop="id" label="序号" width="50" header-align="center" align="center"></el-table-column>
            <el-table-column prop="name" label="农作物名称" width="80" header-align="center"
                align="center"></el-table-column>
            <el-table-column prop="location" label="农作物位置" width="100" header-align="center"
                align="center"></el-table-column>
            <el-table-column prop="amount" label="施肥情况" width="110" header-align="center" align="center"></el-table-column>
            <el-table-column prop="temp" label="环境温度" width="60" header-align="center" align="center"></el-table-column>
            <el-table-column prop="humidity" label="湿度" width="60" header-align="center"
                align="center"></el-table-column>
            <el-table-column prop="image" label="图片" width="140" header-align="center" align="center">
                <template slot-scope="{ row }">
                    <el-image style="width: auto; height: 40px; border: none; cursor: pointer"
                        :src="row.image"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="light" label="光照" width="90" header-align="center" align="center"></el-table-column>
            <el-table-column prop="ill" label="病虫害情况" width="160" header-align="center"
                align="center"></el-table-column>
            <el-table-column label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="selectById(scope.row.id)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteById(scope.row.id)">删除</el-button>
                    <el-button type="primary" size="mini" @click="makeQRCode(scope.row);dialogQrleVisible = true" style="margin-top: 10px;">生成溯源二维码</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 表格end -->
        <br>
        <!-- 分页条 -->
        <div class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :background="background" :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { getToken } from "@/utils/auth";
import QRCode from "qrcodejs2";

export default {
    name: 'crops',
    data() {
        return {
            dialogQrleVisible:false,
            //表格数据
            cropsData: [
            // { id: 1, name: "苹果", location: "李家村", amount: "一遍百菌清", temp: "25摄氏度", humidity: "17%", image: "", light: "446Lux", ill: "叶斑病" },
            ],
            searchCrops: {
                name: null,
                location: null,
                ill: null
            },
            background: true,
            // 当前页码
            currentPage: 1,
            // 每页显示的条数
            pageSize: 10,
            // 总记录数
            totalCount: 100,
            // 添加数据对话框是否展示的标记
            dialogVisible: false,
            // 被选中的id数组
            selectedIds: [],
            // 复选框选中数据集合
            multipleSelection: [],
            token: { token: getToken() },
            crops: {
                id: "",
                image: "",
            },
            tableHeight:window.innerHeight-320,
        }
    },

    mounted() {
        this.page();//页面加载完成后，发送异步请求，获取数据
        console.log("页面加载完成");
        console.log(this.searchCrops);

    },

    methods: {
        downs(){
            // //找到canvas标签
            let myCanvas = document.getElementById('qrcode').getElementsByTagName('canvas');
            let img=document.getElementById('qrcode').getElementsByTagName('img')
            // // //创建一个a标签节点
            let a= document.createElement("a")
            // //设置a标签的href属性（将canvas变成png图片）
            let imgURL=myCanvas[0].toDataURL('image/jpg');
            let ua = navigator.userAgent;
            if (ua.indexOf("Trident") != -1 && ua.indexOf("Windows") != -1) { // IE内核 并且  windows系统 情况下 才执行;
                var bstr = atob(imgURL.split(',')[1])
                var n = bstr.length
                var u8arr = new Uint8Array(n)
                while (n--) {
                  u8arr[n] = bstr.charCodeAt(n)
                }
                var blob = new Blob([u8arr])
                window.navigator.msSaveOrOpenBlob(blob, '下载' + '.' + 'png')
            }else if(ua.indexOf("Firefox") > -1){ //火狐兼容下载
                let blob = this.base64ToBlob(imgURL); //new Blob([content]);
                let evt = document.createEvent("HTMLEvents");
                evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
                a.download = ' ';//下载图片名称，如果填内容识别不到，下载为未知文件，所以我这里就不填为空
                a.href = URL.createObjectURL(blob);
                a.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));//兼容火狐
            }else{ //谷歌兼容下载
                img.src=myCanvas[0].toDataURL('image/jpg');
                // a.href = myCanvas[0].toDataURL('image/png').replace('image/png', 'image/octet-stream')
                a.href=img.src
                //设置下载文件的名字
                a.download = "溯源二维码"
                 //点击
                a.click()
            }
        },
        //base64转blob
        base64ToBlob(code) {
            let parts = code.split(';base64,');
            let contentType = parts[0].split(':')[1];
            let raw = window.atob(parts[1]);
            let rawLength = raw.length;
            let uInt8Array = new Uint8Array(rawLength);
            for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], {type: contentType});
        },

        makeQRCode(row) {
            console.log(1);
            setTimeout(() => {
                new QRCode(this.$refs.qrCodeUrl, {
                text: "农产品名称："+row.name+"\n\n"+"农产品产地：山东"+row.location+"\n\n"+"农产品病虫害情况："+row.ill+"\n\n"+"农产品施肥情况："+row.amount, // 二维码的内容
                width: 150,
                height: 150,
                colorDark: '#000',
                colorLight: '#fff',
                correctLevel: QRCode.CorrectLevel.H
            });
            }, 0)
        },

        //查询分页数据
        page() {
            axios.get("/crops?page=" + this.currentPage + "&pageSize=" + this.pageSize + "&name=" + this.searchCrops.name + "&location=" + this.searchCrops.location + "&ill=" + this.searchCrops.ill).then((result) => {
                this.totalCount = result.data.data.total;
                this.cropsData = result.data.data.rows;
                console.log(result.data.data);
            })
        },

        // 复选框选中后执行的方法
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(this.multipleSelection[0]);
        },

        //查询方法
        onSubmit() {
            this.currentPage = 1;
            this.page();
        },

        //清除-置空查询表单
        clear() {
            this.searchCrops = { name: "", location: "", ill: "" };
            this.page();
        },

        //添加/编辑数据
        ensure() {
            let operator;

            if (this.crops.id) {
                //修改
                console.log(this.crops.id + "调用修改操作");
                console.log(this.crops);
                operator = this.update(this.crops);
            } else {
                //添加
                console.log("调用添加操作");
                console.log(this.crops);
                operator = this.add(this.crops);
            }
            //关闭新窗口
            this.dialogVisible = false;

            //清空数据模型
            this.crops = { id: "", image: "" };    
        },

        //添加方法
        add(crops) {
            console.log("调用添加成功");
            axios.post("/crops", crops).then((result) => {
                //console.log(result.data);
                if (result.data.code == "1") {
                    this.$message({ message: "恭喜你，添加成功", type: "success" });
                    //重新加载刷新表格
                    this.page();
                } else {
                    this.$message.error(result.data.msg);
                }
            })
        },

        //编辑方法
        update(crops) {
            console.log("调用修改成功");
            axios.put('/crops', crops).then((result) => {
                console.log(result.data);
                if (result.data.code == "1") {
                    this.$message({ message: "恭喜你，修改成功", type: "success" });
                    //重新加载刷新表格
                    this.page();
                } else {
                    this.$message.error(result.data.msg);
                }
            })
        },

        //根据ID查询农作物 -- 回显
        selectById(id) {
            this.crops.id = id;
            //1.打开窗口
            this.dialogVisible = true;
            //2.发送请求
            axios.get("/crops/" + id).then((result) => {
                this.crops = result.data.data;
                this.crops;
            })
        },

        //分页
        handleSizeChange(val) {
            // 重新设置每页显示的条数
            this.pageSize = val;
            console.log(this.pageSize);
            this.page();
        },

        handleCurrentChange(val) {
            // 重新设置当前页码
            this.currentPage = val;
            console.log(this.currentPage);
            this.page();
        },

        //删除方法
        deleteById(id) {
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.delete("/crops/" + id, id).then((result) => {
                    if (result.data.code == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        //重新获取表格数据
                        this.page();
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        // 批量删除农作物信息
        deleteByIds() {
            // 弹出确认提示框
            this.$confirm("此操作将删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                //用户点击确认按钮
                //1. 创建id数组, 从 this.multipleSelection 获取即可
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    this.selectedIds[i] = this.multipleSelection[i].id;
                }
                console.log("批量删除id为"+this.selectedIds);

                //2. 发送AJAX请求
                axios.delete("/crops/" + this.selectedIds, this.selectedIds).then((result) => {
                    if (result.data.code == "1") {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        //重新获取表格数据
                        this.page();
                    } else {
                        this.$message.error(resp.data.msg);
                    }
                });
            }).catch(() => {
                //用户点击取消按钮
                this.$message.info("已取消删除");
            });
        },

        //文件上传相关
        handleAvatarSuccess(res, file) {
            this.crops.image = res.data;
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpeg";
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error("上传图片只能是 JPG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传图片大小不能超过 2MB!");
            }
            return isJPG && isLt2M;
        },

    },
}
</script>

<style>
#qrcode {
    margin-left: 50px;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
}

.avatar {
    width: 100px;
    height: 100px;
    display: block;
}

.pagination {
    width: 720px;
    /* border: 2px solid #409eff; */
    margin: 0 auto;
}
</style>
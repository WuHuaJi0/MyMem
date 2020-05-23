<template>
    <div>
        <el-container>
            <el-aside width="200px">
                <p><i class="el-icon-connection"></i>QUICK CONNECT</p>
            </el-aside>
            <el-main>
                <el-form ref="form" :model="connect" label-width="80px" class="connect-form">
                    <el-form-item label="host">
                        <el-input v-model="connect.host"></el-input>
                    </el-form-item>
                    <el-form-item label="port">
                        <el-input v-model="connect.port"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">Connect</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>

<script>

    import { Cache } from "../tools/Cache"
    const mainProcess = remote.require("./electron-main.js").main;

    export default {
        name: "NewConnect",
        data() {
            return {
                connect: {
                    host: '127.0.0.1',
                    port: '11211',
                }
            }
        },
        mounted() {
        },
        methods: {
            async onSubmit() {

                try {
                    let result = await mainProcess.connect(this.connect.host, this.connect.port);
                    Cache.set("keys",result);
                    this.$router.push("/home");
                } catch (err) {
                    //todo: alert the error message
                    console.log(err)
                }
            }
        }
    }
</script>

<style scoped>
    .el-container {
        height: 100vh;
    }

    .el-aside {
        background: #eee;
        padding: 10px;
    }
    .connect-form{
        width: 500px;
        margin: 200px auto 0;
        padding: 20px;
        box-sizing: border-box;
        background: #eeeeee;
    }
</style>

<template>
    <div>
        <el-container>
            <el-aside width="200px">
                <p><i class="el-icon-s-promotion"></i>Keys</p>
                <p v-for="key in keys" v-text="key" @click="getValue(key)"></p>
            </el-aside>
            <el-main>
                <el-input
                        type="textarea"
                        autosize
                        placeholder="Please fill your content."
                        v-model="value">
                </el-input>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import {Cache} from "../tools/Cache";
    const mainProcess = remote.require("./electron-main.js").main;
    export default {
        name: "Browser",
        mounted() {
            console.log(Cache.get("keys"));
            console.log(this.keys);
        },
        data(){
            return {
                keys: Cache.get("keys"),
                value: "",
            }
        },
        methods: {
            async getValue(key){
                try {
                    this.value = await mainProcess.get(key)
                }catch(err){
                    //todo: show the err message.
                    console.log(err);
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
    .el-textarea__inner{
        border: none;
    }
</style>

<template>
    <div>
        <el-container>
            <el-aside width="200px">
                <p><i class="el-icon-s-promotion"></i>Keys <i class="el-icon-circle-plus" @click="toggleShowAdd"></i>
                </p>
                <el-row type="flex" v-show="showAddNewKey">
                    <el-input v-model="newKey" placeholder="Enter key." size="small"></el-input>
                    <el-button size="small" @click="addNewKey">Confirm</el-button>
                </el-row>
                <p v-for="key in keys" v-text="key" @click="getValue(key)"></p>
            </el-aside>

            <el-main>
                <el-input
                        type="textarea"
                        autosize
                        placeholder="Please fill your content."
                        v-model="currentValue">
                </el-input>

                <el-row>
                    <el-button size="small" @click="saveChange" :disabled="originValue == currentValue">Save Change
                    </el-button>
                </el-row>

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
        },
        data() {
            return {
                keys: [],
                originValue: "",
                currentValue: "",
                currentKey: "",
                newKey: "",
                showAddNewKey: false,
            }
        },
        async mounted() {
            try {
                this.keys = await mainProcess.keys();
            } catch (e) {
                this.$message.error("Connect error");
                let that = this;
                setTimeout(function () {
                    that.$router.push("/");
                },1500)
            }
        },
        methods: {
            addNewKey() {
                if (!this.newKey) {
                    this.$message({
                        type: "error",
                        message: "Please enter the key."
                    });
                    return;
                }
                mainProcess.set(this.newKey, "", 10000)
                this.keys.push(this.newKey);
                this.newKey = "";
            },
            toggleShowAdd() {
                this.showAddNewKey = !this.showAddNewKey;
            },
            async getValue(key) {
                this.currentKey = key;
                try {
                    this.currentValue = this.originValue = await mainProcess.get(key)
                } catch (err) {
                    //todo: show the err message.
                    console.log(err);
                }
            },
            async saveChange() {
                try {
                    await mainProcess.set(this.currentKey, this.currentValue, 10000)
                    this.$message({
                        message: 'Change Saved!',
                        type: 'success'
                    });
                    this.originValue = this.currentValue;
                } catch (e) {
                    //todo: show the error message.
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

    .connect-form {
        width: 500px;
        margin: 200px auto 0;
        padding: 20px;
        box-sizing: border-box;
        background: #eeeeee;
    }

    .el-row {
        margin-top: 15px;
    }
</style>

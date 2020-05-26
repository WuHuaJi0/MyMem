<template>
    <div>
        <el-container>
            <el-aside width="200px">
                <div class="keysTitle">
                    <div>
                        <i class="el-icon-s-promotion"></i>Keys
                    </div>
                    <el-button icon="el-icon-plus" size="mini" @click="toggleShowAdd"></el-button>
                </div>
                <el-row type="flex" v-show="showAddNewKey">
                    <el-input v-model="newKey" placeholder="Enter key." size="small"></el-input>
                    <el-button size="small" @click="addNewKey">Confirm</el-button>
                </el-row>
                <div class="keyItemContainer">
                    <p class="keyItem" v-for="(key,index) in keys" @click="getValue(key,index)" :class="{ current : index == currentEditKey } ">
                        <i class="el-icon-info"></i> {{ key }}
                    </p>
                </div>
            </el-aside>

            <el-main>
                <div class="editArea" v-show="showEditArea">
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
                </div>
                <div class="plainArea" v-show="!showEditArea">
                    <i class="el-icon-message-solid"></i>Select key in left panel.</div>
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
                showEditArea: false,
                originValue: "",
                currentValue: "",
                currentKey: "",
                newKey: "",
                showAddNewKey: false,
                currentEditKey: null,
            }
        },
        async mounted() {
            try {
                this.keys =  await mainProcess.keys();
            } catch (e) {
                this.$message.error("Connect error");
                let that = this;
                setTimeout(function () {
                    that.$router.push("/");
                }, 1500)
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
                this.currentEditKey = null;
                this.showEditArea = false;
            },
            async getValue(key,index) {
                this.showEditArea = true;
                this.currentKey = key;
                this.currentEditKey = index;
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
    .keysTitle{
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #666666;
        padding: 10px;
    }
    .keyItemContainer{
        margin-top: 10px;
    }
    .keyItem{
        color: #666;
        padding: 5px 10px;
        cursor: pointer;
    }
    .keyItem.current{
        background: #999;
        color: #fff;
    }
    .plainArea{
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        color: #999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 25px;
    }
    .plainArea i{
        margin-right: 10px;
    }
</style>

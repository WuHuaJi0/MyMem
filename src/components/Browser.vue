<template>
    <div>
        <el-container>
            <el-aside width="200px" v-loading="refreshKeysLoading" element-loading-text="Refresh Keys">
                <div class="keysTitle">
                    <div>
                        <i class="el-icon-s-promotion"></i>Keys
                    </div>
                    <div>
                        <el-button icon="el-icon-plus" size="mini" @click="toggleShowAdd"></el-button>
                        <el-button icon="el-icon-refresh-left" size="mini" @click="refreshKeys"></el-button>
                    </div>
                </div>
                <div class="keyItemContainer">
                    <p class="keyItem" v-for="(key,index) in keys" @click="getValue(key,index)"
                       :class="{ current : index == currentEditKey } ">
                        <i class="el-icon-info"></i> {{ key }}
                    </p>
                </div>
            </el-aside>

            <el-main>
                <el-dialog title="Add new key" :visible.sync="showAddNewKey" width="30%">
                    <el-form ref="form" :model="newKey" label-width="80px">
                        <el-form-item label="name">
                            <el-input v-model="newKey.name" placeholder="your-key-name"></el-input>
                        </el-form-item>
                        <el-form-item label="expiration">
                            <el-input v-model="newKey.expiration" type="number"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="showAddNewKey = false">Cancel</el-button>
                        <el-button type="primary" @click="addNewKey">Confirm</el-button>
                    </span>
                </el-dialog>

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
                    <i class="el-icon-message-solid"></i>Select key in left panel.
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    const mainProcess = remote.require("./electron-main.js").main;
    export default {
        name: "Browser",
        data() {
            return {
                newKey: {
                    name: "",
                    expiration: 100,
                },
                refreshKeysLoading: false,
                keys: [],
                showEditArea: false,
                originValue: "",
                currentValue: "",
                currentKey: "",
                showAddNewKey: false,
                currentEditKey: null,
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
                }, 1500)
            }
        },
        methods: {
            async refreshKeys() {
                this.refreshKeysLoading = true;
                try {
                    this.keys = await mainProcess.keys();
                    setTimeout(() => this.refreshKeysLoading = false, 500)
                } catch (e) {
                    console.log(e)
                    this.$message.error("Connect error");
                    let that = this;
                    setTimeout(function () {
                        that.$router.push("/");
                    }, 1500)
                }
            },
            addNewKey() {
                if (!this.newKey.name || this.newKey.expiration <= 0 ) {
                    this.$message({
                        type: "error",
                        message: "Please enter the key."
                    });
                    return;
                }
                mainProcess.set(this.newKey.name, "", this.newKey.expiration)
                this.keys.push(this.newKey.name);
                this.newKey.name = "";
                this.showAddNewKey = false;
            },
            toggleShowAdd() {
                this.showAddNewKey = !this.showAddNewKey;
                this.currentEditKey = null;
                this.showEditArea = false;
            },
            async getValue(key, index) {
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
    .keysTitle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #666666;
        padding: 10px;
    }

    .keyItemContainer {
        margin-top: 10px;
    }

    .keyItem {
        color: #666;
        padding: 5px 10px;
        cursor: pointer;
    }

    .keyItem.current {
        background: #999;
        color: #fff;
    }

    .plainArea {
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

    .plainArea i {
        margin-right: 10px;
    }
</style>

<template>
    <div>
        <el-container>
            <el-aside width="200px">
                <div class="quick-connect" @click="editQuickConnect">
                    <i class="el-icon-s-tools"></i>Quick Connect
                </div>
                <div class="favorites">
                    Favorites
                </div>
                <el-row type="flex" justify="space-around" class="connection" v-for="(connection ,index) in connections"
                        @click.native="editConnection(index)"
                        :class="{ current: connection.current}">
                    <el-col :span="20" class="connection-name">
                        <i class="el-icon-s-home"></i>{{ connection.name }}
                    </el-col>
                    <el-col :span="4">
                        <i class="el-icon-delete" v-show="connection.current" @click.stop="delConnection(index)"></i>
                    </el-col>
                </el-row>
            </el-aside>
            <el-main v-loading="connectLoading">
                <el-form ref="form" :model="connect" label-width="80px" class="connect-form">
                    <el-form-item label="host">
                        <el-input v-model="connect.host"></el-input>
                    </el-form-item>
                    <el-form-item label="port">
                        <el-input v-model="connect.port"></el-input>
                    </el-form-item>
                    <el-form-item label="name">
                        <el-input v-model="connect.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="connectServer">Connect</el-button>
                        <el-button v-show="isQuickConnect" @click="addToFavorites">Add to Favorites</el-button>
                        <el-button v-show="!isQuickConnect" @click="saveChanges">Save Changes</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import {Cache} from "../tools/Cache"
    const mainProcess = remote.require("./electron-main.js").main;

    export default {
        name: "Connect",
        data() {
            return {
                connectLoading: false,
                isQuickConnect: true,
                connect: {
                    host: '127.0.0.1',
                    port: '11211',
                    name: 'local',
                    current: false,
                },
                connections: Cache.get("Connections"),
            }
        },
        methods: {
            delConnection(index){
                this.connections.splice(index,1);
                Cache.set("Connections",this.connections);
                if (this.connections.length == 0 ){
                    this.editQuickConnect();
                }
            },
            editQuickConnect(){
                this.isQuickConnect = true;
                this.connect = {
                    host: "127.0.0.1",
                    port: "11211",
                    name: "local",
                    current: false,
                }
                this.connections.forEach(item => item.current = false);
            },
            editConnection(index){
                this.connections.forEach(item => item.current = false);
                this.connections[index]['current'] = true;
                this.isQuickConnect = false;
                this.connect = this.connections[index];
            },
            saveChanges(){
                let index = this.connections.findIndex(item => item.current == true);
                this.connections[index] = this.connect;
                Cache.set("Connections",this.connections);
                this.$message({
                    message: "Change Saved!",
                    type: "success",
                })
            },
            addToFavorites() {
                if (!this.connect.host || !this.connect.port) {
                    return this.$message({
                        message: "Please fill the host and port",
                        type: "error",
                    })
                }
                Cache.appendToArray("Connections",this.connect);
                this.connections = Cache.get("Connections");
                this.$message({
                    type: "success",
                    message: "Add to Favorites!"
                })
            },
            async connectServer() {
                this.connectLoading = true
                try {
                    await mainProcess.connect(this.connect.host, this.connect.port);
                    await mainProcess.keys();
                    this.$router.push("/browser");
                } catch (err) {
                    this.connectLoading = false;
                    this.$message({
                        type: "error",
                        message: "Connect error",
                    })
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
        color: #666;
    }
    .el-main{
        position: relative;
    }

    .connect-form {
        width: 500px;
        padding: 20px;
        box-sizing: border-box;
        background: #eeeeee;
        height: 268px;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
    }
    .connection{
        cursor: pointer;
    }
    .quick-connect{
        padding: 10px 20px;
        cursor: pointer;
    }
    .favorites{
        padding: 0 2px;
    }
    .connection{
        padding: 4px 20px;
    }
    .connection.current{
        background: #999;
        color: #fff;
    }
    .connection-name{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .connection i{
        margin-right: 5px;
    }
</style>

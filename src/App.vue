<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<style>
    * {
        margin: 0;
        padding: 0;
    }
    html,body{
        height: 100vh;
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    }
</style>
<script>

    export default {
        name: 'app',
    }
</script>

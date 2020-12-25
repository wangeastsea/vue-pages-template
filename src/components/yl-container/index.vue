<template lang="pug">
.yx-container
    .yx-top
        slot(name="top")
    .yx-main
        slot(name="main")
    .yx-bottom
        slot(name="bottom")
</template>

<style lang="scss" scoped>
.yx-container {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .yx-main {
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        flex: 1;
        height: 100%;
    }
}
</style>

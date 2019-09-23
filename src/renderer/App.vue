<template>
  <div id="app" >
    <div style="height: 20px;">
      <title-bar-f/>
    </div>
    <router-view style="height:100%"></router-view>
  </div>
</template>

<script>
import TitleBarF from '_c/title-bar-f'
import { ipcRenderer } from 'electron'

  export default {
    name: 'electron-vue',
    components: {
      TitleBarF,
    },
    mounted(){
      var self = this
      ipcRenderer.on('music-win-size-change', (e, size) => {
        // self.$Message.info(size.)
        console.log('size',size)
      });
      
    }

  }
</script>

<style>
  /* CSS */
  body {
  overflow:hidden;
    width: 100%;
    height:100%;
    /* background: rgba(0, 0, 0, 0); */
  }
  #app{
  overflow:hidden;
    width: 100%;
    height:100%;
  }
</style>

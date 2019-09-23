<template>
    <div class="title-bar" >
      <a href="javascript:;" @click="closeWindow()" style="-webkit-app-region:no-drag;">
        <circle-f color="red" style="margin-top:4px;margin-left:4px;display:inline-block"></circle-f>
      </a>
      <a href="javascript:;" @click="maxWindow()" style="-webkit-app-region:no-drag;">
        <circle-f color="yellow" style="margin-top:4px;margin-left:4px;display:inline-block"></circle-f>
      </a>
      <a href="javascript:;" @click="minWindow()" style="-webkit-app-region:no-drag;">
         <circle-f color="green" style="margin-top:4px;margin-left:4px;display:inline-block"></circle-f>
      </a>
    </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import CircleF from '_c/circle-f'

export default {
  name: 'title-bar-f',
    components: {
      CircleF,
    },
    methods: {
      countAdd(){
        this.count++
      },
      closeWindow(){
        ipcRenderer.send('close');
      },
      minWindow(){
        ipcRenderer.send('min');
      },
      maxWindow(){
        ipcRenderer.send('max');
      },
    }

}
</script>

<style scoped>
.title-bar{
  -webkit-app-region:drag;
  background:#000;
  position: fixed;
  /* display: inline-block; */
  width: 100%;
  /* height: 20px; */
  top:0;
  left:0;
  z-index:1000;
}

</style>
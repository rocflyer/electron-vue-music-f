<template>
    <div >
      <div class="circle" :style="{background:color}"></div>
    </div>
</template>

<script>
export default {
  name: 'CircleF',
  components: {
    
  },
  props: {
    color: {
      type: String,
      default: '#2d8cf0'
    },
  }
}
</script>

<style lang="less">
  .circle{   
    width: 12px;    
    height: 12px;    
    // background-color:red; 
    border-radius: 50%;     
    -moz-border-radius: 50%;  
    -webkit-border-radius: 50%;   
  }
</style>

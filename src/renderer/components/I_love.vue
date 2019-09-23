<template>
  <div class="i-love-body">
      我喜欢

  </div>
</template>

<script>

  export default {
    name: 'i_love',
    components: {
    },
    data(){
      return{

      }
    },
    methods: {
    },
    computed: {
    },
  }
</script>

<style lang="less" >
.size{
  width: 100%;
  height: 100%;
}
.i-love-body{
  .size;
  // text-align:center;
  // padding:0px;
  overflow:hidden;
  animation: swing ;
  animation-duration: 1s;
  animation-delay: 0s;
}
</style>

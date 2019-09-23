<template>
  <div class="mv-body">
      MV

  </div>
</template>

<script>

  export default {
    name: 'MV',
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
.mv-body{
  .size;
  // text-align:center;
  // padding:0px;
  overflow:hidden;
  animation: swing ;
  animation-duration: 1s;
  animation-delay: 0s;
}
</style>

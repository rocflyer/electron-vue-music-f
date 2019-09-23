<template>
  <div class="main-body">
    <div style="width:200px">
      <Sider style="position: fixed; height: 100vh; background:#ffa726; " ref="side1" hide-trigger collapsible :collapsed-width="78" >
        <div class="user-background" >
          <div class="animated infinite bounce delay-1s">
            <Avatar size="large"  style="margin-top:30px" src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
          </div>
        </div>
          <Menu class="menu-theme" @on-select="ToastF" active-name="search" theme="light" width="auto" style="background:#ffb74d">
              <MenuItem name="local_music">
                  <Icon type="ios-navigate"></Icon>
                  <span>本地音乐</span>
              </MenuItem>
              <MenuItem name="i_love">
                  <Icon type="ios-search"></Icon>
                  <span>我喜欢{{winSize}}</span>
              </MenuItem>
              <MenuItem name="MV">
                  <Icon type="ios-settings"></Icon>
                  <span>MV</span>
              </MenuItem>
          </Menu>
      </Sider>
    </div>
    <div class="content-div">
      <router-view/>
    </div>
    <!-- currentMusic:{{currentMusic}}<br/>
    nextMusic:{{nextMusic}} -->
      <player-f 
      v-model="isPlay" 
      id="music-player1"
      @on-mode-change="changePlayMode" 
      :musicPath="currentMusic.path" 
      :width="winSize[0]"
      />

  </div>
</template>

<script>
import PlayerF from '_c/player-f'
import { ipcRenderer } from 'electron'

  export default {
    name: 'Main',
    components: {
      'player-f':PlayerF,
    },
    data(){
      return{
        currentItem:'',
        /*
        **ing为进行
        */
        isPlay:'pause',
        winSize:[800,680],
      }
    },
    methods: {
      ToastF(name){
        if(this.currentItem === name) {
          return
        }
        this.currentItem = name;
        this.$Message.info(name)
        M.toast({html: name})
        this.$router.replace({name:name});

        // switch(name){
        //   case 'local_music':
        //     this.$router.replace({name:name});
        //     break;
        //   case 'find':
        //     if(this.currentItem === 'find') {
        //       return
        //     }
        //     this.currentItem = name;
        //     this.$Message.info(name)
        //     break;
        //   case 'MV':
        //     if(this.currentItem === 'MV') {
        //       return
        //     }
        //     this.currentItem = name;
        //     this.$Message.info(name)
        //     break;
        //   default:
        //     break;
        // }
      },
      changePlayMode(mode){
        this.$store.dispatch('setPlayMode',mode)

      }
    },
    computed:{
      currentMusic(){
        return this.$store.getters.currentMusic
      },
      nextMusic(){
        return this.$store.getters.nextMusic
      },
      storeIsPlay(){
        // this.isPlay = this.$store.getters.isPlay
        // return this.isPlay = this.$store.getters.isPlay
      }
    },
    watch:{
      isPlay(val,oldval){
        switch(val){
          case 'overing':
            // this.$Message.info('播放结束 自动播放下一首'+this.music_files[this.nextMusic.index].name)

            // this.currentMusic = this.nextMusic;
            // this.setNextMusic();
            
            this.$store.dispatch('playNextMusic')
            this.isPlay = 'load'; 
            // this.$Message.info(this.isPlay)
              
            break;
          default:
            break;
        }
      }
    },    
    mounted(){
      var self = this
      ipcRenderer.on('play-music-to-player', (e) => {
        self.isPlay = 'load'
      });
      ipcRenderer.on('music-win-size-change', (e, size) => {
        // self.$Message.info(size.)
        console.log('size',size)
        this.winSize = size
      });
    }
  }
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
.main-body{
  .size;
  overflow:hidden;
  // background-color: rgba(0, 0, 0,0.7)
  // animation: fadeInLeft 3s infinite;
}
.user-background{
  height:100px;
  background: url(~_a/timg.jpg)no-repeat ;
  background-size:100% 100%; 
  text-align:center;
}
.menu-theme{
  li.ivu-menu-item.ivu-menu-item-active.ivu-menu-item-selected{
    color: #2d8cf0;
    background: #ffcc80;
    z-index: 2;
  }
}

    .content-div{
      height:100%;
      margin-left:200px;
      // background:#fff;
      // background-color: rgba(0, 0, 0,0.7)
    }
    .menu-item span{
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }
    .menu-item i{
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }

    #music-player1{
      z-index:999;
      position: absolute;
      bottom: 0;
    }
</style>

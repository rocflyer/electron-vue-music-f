<template>
  <div class="local-music-body">
    <p id="page-name">本地音乐</p>
    <Button @click="isModalSelectContent = true" style="float:right;margin-top:8px;" size="large" type="text"><i class="ivu-icon ivu-icon-ios-folder-outline"> 选择目录</i></Button>
    <Modal
        v-model="isModalSelectContent"
        title="选择本地音乐文件夹"
        :closable="false"
        :mask-closable="false"
        
        >
        <div>
          <p>将自动扫描如下的目录</p>
          <!-- <p v-for="(local_path,index) in local_paths" :key="local_path">{{local_path}}</p> -->
          <!-- {{local_paths}} -->
          <CheckboxGroup @on-change="showSelect" v-for="(local_path,index) in local_paths" :key="local_path" v-model="selectLocalPath">
            <Checkbox size="large" :label="local_path" style="display:block"></Checkbox>
          </CheckboxGroup>
        </div>
        <div slot="footer">
            <Button type="primary" size="large" @click="deleteLocalPath">删除路径</Button>
            <Button type="primary" size="large" @click="selectContents">添加路径</Button>
            <Button type="error" size="large"  @click="ok_selectContents">确定</Button>
        </div>
    </Modal>
    <Tabs style="margin-left:10px" value="music">
      <TabPane label="歌曲" name="music">
        <a class="waves-effect waves-light btn">播放全部</a>
        <p style="display:inline-block">总计{{music_files.length}}首</p>
        <!-- {{music_files}} -->
        <!-- <br/>
        <br/>
        {{this.$store.getters.musicFiles}} -->
        <div id="music_list">
          <Table :columns="music_table_title" :data="music_files" :height="winSize[1]-250" :show-header="false">
            <template slot-scope="{ row }" slot="name">
              <strong><Tag type="dot" color="success">{{ row.name }}</Tag></strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button type="primary" size="small" style="margin-right: 5px" @click="musicPlay(index)">播放</Button>
            </template>
          </Table>
        </div>
      </TabPane>
      <TabPane label="歌手" name="songer">标签二的内容</TabPane>
      <TabPane label="专辑" name="mv">标签三的内容</TabPane>
    </Tabs>

    {{winSize}}
    父组件中的isPlay:{{isPlay}}
    <!-- {{nextMusic}} -->
    <!-- @current-music-over="musicOverFunc" -->
    <!-- :nextMusicPath="nextMusic.path" -->
    <!-- <player-f v-model="isPlay" 
    @on-mode-change="changePlayMode" 
    :musicPath="currentMusic.path" 
    
    id="music-player"
    /> -->
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import VueAplayer from 'vue-aplayer'
import jsmediatags from 'jsmediatags'
import Player from '@/plugins/Player'
import PlayerF from '_c/player-f'

  export default {
    name: 'local-music',
    components: {
      'a-player': VueAplayer ,
      'player-f':PlayerF,
    },
    data(){
      return{
        isModalSelectContent:false,//添加目录对话框
        // music_files:[],//音乐文件
        // local_paths:[],//音乐路径
        test:this.$store.getters.test,
        music_table_title:[
          {
            title: '名字',
            // key: 'name',
            slot: 'name',
            sortable: true
          },
          {
            title: '专辑',
            key: 'path',
            sortable: true
          },
          // {
          //   title: '艺术家',
          //   key: 'artist',
          //   sortable: true
          // },
          {
            title: 'Action',
            slot: 'action',
            width: 150,
            align: 'center'
          }
        ],
        selectLocalPath:[],
        audio : new Audio(),
        isPlay:'pause',
        currentMusic:{path:'',index:-1},//当前播放音乐信息 路径,位置
        nextMusic:{path:'',index:-1},//下一首播放音乐信息 路径,位置
        playerMode:'order',//播放模式
        winSize:[800,680],
      }
    },
    methods: {
      ToastF(){
         M.toast({html: 'I am a toast!'})
      },
      selectContents(){
        ipcRenderer.send('open-file-dialog')
      },
      ok_selectContents(){
        this.isModalSelectContent = false;
      },
      showSelect(){
        console.log('selectLocalPath：',this.selectLocalPath)
      },
      deleteLocalPath(){
        this.$store.dispatch("deleteLocalPath",this.selectLocalPath);
        // this.local_paths = this.$store.getters.localPath.concat()
        // this.local_paths.length -= 1
        // this.local_paths = [1,2,3,4,5]
      },
      musicPlay(index){
        this.$Message.info('播放'+this.music_files[index].name)

        // var audio = document.getElementById('audio');

        this.$store.dispatch('setCurrentMusic',{path:this.music_files[index].path,index:index})
        ipcRenderer.send('play-music-to-main')//播放音乐
        // this.$store.dispatch('setIsPlay','load')

        // this.currentMusic = {path:this.music_files[index].path,index:index};
        // this.setNextMusic();
        // this.isPlay = 'load';


      },
      //改变播放模式 'single'-单曲循环 'order'-顺序播放 'random'-随机播放
      //在模式改变时计算好下一次播放的音乐
      changePlayMode(mode){
        this.playerMode = mode;
        this.setNextMusic()
      },
      setNextMusic(){
        switch(this.playerMode) {
          case "order":
            if(this.currentMusic.index + 1 >= this.music_files.length) {
              this.nextMusic = {path:this.music_files[0].path,index:0}
            } else {
              this.nextMusic = {path:this.music_files[this.currentMusic.index + 1].path,index:this.currentMusic.index + 1}
            }
            this.$Message.info('顺序播放')
            break;
          case "random":
            var index = Math.ceil(Math.random()*(this.music_files.length - 1))
            this.nextMusic = {path:this.music_files[index].path,index:index}
            this.$Message.info('随机播放')
            break;
          case 'single':
            this.nextMusic = this.currentMusic;
            this.$Message.info('单曲循环')
            break;
          default:
            if(this.currentMusic.index + 1 >= this.music_files.length) {
              this.nextMusic = {path:this.music_files[0].path,index:0}
            } else {
              this.nextMusic = {path:this.music_files[this.currentMusic.index + 1].path,index:this.currentMusic.index + 1}
            }
            this.$Message.info('播放模式错误')
            break;
        }
      }
    },
    computed: {
      //使用计算方式获取音乐路径
      local_paths(){
        ipcRenderer.send('read-all-file')
        this.$Message.info('local_paths() 计算')
        return this.$store.getters.localPath
      },
      //使用计算方式获取音乐文件
      music_files(){
        this.$Message.info('music_files() 计算')
        return this.$store.getters.musicFiles
      },
      win_size(){
        this.$Message.info('长度：'+this.$store.getters.winSize[0]+' 宽度：'+this.$store.getters.winSize[1])
        return this.$store.getters.winSize
      }
    },
    watch:{
      isPlay(val,oldval){
        switch(val){
          case 'overing':
            this.$Message.info('播放结束 自动播放下一首'+this.music_files[this.nextMusic.index].name)

            this.currentMusic = this.nextMusic;
            this.setNextMusic();
            this.isPlay = 'load'; 
            this.$Message.info(this.isPlay)
              
            break;
          default:
            break;
        }
      }
    },
    mounted(){
      // var test = new Player();
      // console.log('Audio1:',test._audioPlayer)
      // this.audio = new Audio();
      //仅用来获取音乐文件，不用来获取音乐路径
      // var self = this
      ipcRenderer.on('music-win-size-change', (e, size) => {
        // self.$Message.info(size.)
        console.log('size',size)
        this.winSize = size
      });
      // this.$Message.info('local_music mounted')
      // this.$store.dispatch("clearLocalPath");

    },
    destroyed(){
      // ipcRenderer.removeAllListeners(['music-files'])
    }
  }
</script>

<style lang="less" >
.size{
  width: 100%;
  height: 100%;
}
.local-music-body{
  .size;
  // text-align:center;
  // padding:0px;
  overflow:hidden;
  // display: flex;
}
#page-name{
  font-size: 14px;
  margin-top: 12px;
  margin-left: 12px;
  display: inline-block;
  animation: wobble ;
  animation-duration: 1s;
  animation-delay: 0s;

}
#music_list{
  margin-top: 10px;
  div.ivu-card-body {
    padding: 0;
  }
  div.ivu-table-wrapper {
    border: none;
    // border-right: 0;
    // border-left: 0;
  }
  .ivu-table-body.ivu-table-overflowY{
    overflow: hidden;
  }
  //鼠标悬浮时显示滚动条
  .ivu-table-body.ivu-table-overflowY:hover{
    overflow: auto;
  }

  .ivu-table:before{content:'';width:100%;height:0px;position:absolute;left:0;bottom:0;z-index:1}
  .ivu-table:after{content:'';width:0px;height:100%;position:absolute;top:0;right:0;z-index:3}
}

#audio{
  position:fixed;
  bottom:0;
  // left:0;
  width:70%;
  margin-left:10px;
  // margin-right:10px;
}
#music-player{
  bottom: 0px;
  position: absolute;
  width: 60%;
  margin-top: auto;

}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/  
::-webkit-scrollbar  
{  
    width: 6px;  
    height: 6px;  
    background-color: #F5F5F5;  
}  
  
/*定义滚动条轨道 内阴影+圆角*/  
::-webkit-scrollbar-track  
{  
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);  
    border-radius: 10px;  
    background-color: #FFF;  
}  
  
/*定义滑块 内阴影+圆角*/  
::-webkit-scrollbar-thumb  
{  
    border-radius: 10px;  
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);  
    background-color: #AAA;  
}  

</style>

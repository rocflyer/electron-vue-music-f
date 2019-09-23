<template>
  <div style="background:#eee;width:100%">
    <!-- <p>我是子组件</p> -->
    
    
    <!-- 子组件：{{isPlay}} {{width}} -->
    <!-- {{audio.currentTime}}总时长：{{totalTime}}
    {{nextMusicPath}} -->
    <!-- {{this.$store.getters.playMode}} -->
    <canvas id="canvas" :width="width" height="100" style="position:fixed;z-index:-1"></canvas>
    <canvas id="bg" :width="width" height="100" style="position:fixed;z-index:-1"></canvas>
          
          <div id="album-img" class="z-depth-5"></div>
          <Button id="play-pause" size="small" type="dashed" shape="circle" @click="returnBackFn()">
            <Icon :type="isPlay==='pauseing' ? 'md-play' : 'md-pause'" size="16"/>
          </Button>
          <Button id="play-mode" size="small" type="dashed" shape="circle" @click="returnBackMode()">
            <Icon :type="currentMode.icon" size="16"/>
          </Button>
          <Poptip word-wrap width="200" >
            <Button id="play-volume" size="small" type="dashed" shape="circle">
              <Icon  type="md-volume-mute" size="16"/><br/>
            </Button>
            <div slot="content">
              <Slider style="padding-right:10px" v-model="volume" :tip-format="hideFormat"></Slider>
            </div>
          </Poptip>

          <Slider :value="currentTime" id="music-progress-bar" :max="totalTime" @on-change="changePlayerTime"></Slider>

    <!-- <Row style="height:100px">
        <Col span="16">
          <div id="album-img"></div>
        </Col>
        <Col span="1">
          <Button id="play-pause" @click="returnBackFn()">{{isPlay==='pause' ? '播放' : '暂停'}}</Button>
        </Col>
        <Col span="100"style="bottom:-60px">
          <Slider :value="currentTime" id="music-progress-bar" :max="totalTime" @on-change="changePlayerTime"></Slider>
        </Col>
    </Row> -->
  </div>
</template>

<script>
import jsmediatags from 'jsmediatags'

export default {
  name: 'local-music',
  props:['isPlay','musicPath','nextMusicPath','width'],
  model:{
    prop: 'isPlay',
    event: 'returnBack'
  },
  data(){
    return{
      stopAnimationTimer:null,
      audio : new Audio(),
      currentState:false,
      currentTime:20,
      totalTime:100,
      currentMode:{name:'order',icon:'md-menu'},//当前模式
      volume:50,//音量
      isWatchisPlay:false,
      isWatchMusicPath:false,
      av:{
        AudioContext:AudioContext || webkitAudioContext,
        context:null,
        source:null, 
        analyser:null, 
        p:null, 
        penBg:null, 
        dataArray:null, 
        gradient:null, 
        gradientRight:null
      },
      requestAnimationFrameID:'',
      isBeginAnimation:false,//是否停止动画
    }
  },
  methods: {
    canvasInit(){
      this.$Message.info("canvasInit()")
      var canvas = document.getElementById('canvas');
      var bg = document.getElementById('bg');

	    this.av.AudioContext = AudioContext || webkitAudioContext;
	    this.av.context = new this.av.AudioContext;
	    //加载媒体

	    //创建节点
	    this.av.source = this.av.context.createMediaElementSource(this.audio);
	    this.av.analyser = this.av.context.createAnalyser();
	    //连接：source → analyser → destination
	    this.av.source.connect(this.av.analyser);
	    this.av.analyser.connect(this.av.context.destination);


	    this.av.p = canvas.getContext("2d");
	    this.av.penBg = bg.getContext("2d");

	    this.av.analyser.fftSize = 4096;
	    var length = this.av.analyser.fftSize;
	    //创建数据
	    this.av.dataArray = new Uint8Array(length);


	    // this.av.gradient = this.av.p.createLinearGradient(0, 100, this.width, 100);
	    this.av.gradient = this.av.p.createLinearGradient(0, 100, 1000, 100);
	    this.av.gradient.addColorStop("0", "#f500d8");
	    this.av.gradient.addColorStop("0.25", "#ceaf11");
	    this.av.gradient.addColorStop("0.5", "#0ee7f7");
	    this.av.gradient.addColorStop("0.75", "#2ce672");
	    this.av.gradient.addColorStop("1.0", "#d800f5");

	    // //右边的填充渐变色
	    // this.av.gradientRight = this.av.p.createLinearGradient(470, 100, 940, 100);
	    // this.av.gradientRight.addColorStop("0", "#ceaf11");
	    // this.av.gradientRight.addColorStop("1.0", "#2ce672");
    },
    canvasDraw(){
      // this.$Message.info("canvasDraw()")
      const heightFromGround = 20,//距底部高度
      height = 100,
      width=this.width-100,
      leftLineHeightFromGround=22,//线条距底部高度
      porprpation=77;//比例

      var bounceRange=0;//线条波动范围

      if(['playing',].indexOf(this.isPlay)>=0) {
        bounceRange=10;
      }

      if (this.isPlay === 'playing') {
        this.isBeginAnimation = true;
        if(this.stopAnimationTimer != null) {
          clearTimeout(this.stopAnimationTimer)
          this.stopAnimationTimer = null
        }
      } else {
        if(this.stopAnimationTimer == null) {
          var self = this
          this.stopAnimationTimer = setTimeout(function () {
            self.isBeginAnimation = false;
            self.stopAnimationTimer = null;
          }, 1000);
        }
      }

      if(this.isBeginAnimation) {
        this.requestAnimationFrameID = requestAnimationFrame(this.canvasDraw)
      }

	    this.av.analyser.getByteFrequencyData(this.av.dataArray);
	    this.av.p.clearRect(0, 0, this.width, 100);

	    // //放射性背景
	    // var gradientBg = this.av.penBg.createRadialGradient((this.width-200) / 2, 100 / 2, 100 - Math.floor(Math.random() * 2 + 20), (this.width-200) / 2, 100 / 2, (this.width-200) / 2);
	    // gradientBg.addColorStop(0, "white");
	    // gradientBg.addColorStop(1, '#000');
	    // this.av.penBg.clearRect(0, 0, this.width, 100);
	    // this.av.penBg.fillStyle = gradientBg;
	    // this.av.penBg.fillRect(0, 0, this.width, 100);
	    //左

	    //左填充
	    this.av.p.beginPath();
	    // this.av.p.moveTo(0, height - 200);
	    this.av.p.moveTo(0, height-heightFromGround);
	    var x = 0;
	    for (var i = 1; i < 83; i++) {
	        if (i < 5) {
            var lineHeight = this.av.dataArray[i] / 256 * height / 2;
              // this.av.p.lineTo(x, height - this.av.dataArray[i] / 256 * height / 2 - heightFromGround)
	            this.av.p.lineTo(x, height - lineHeight - heightFromGround)
              // this.av.p.lineTo(x, height - this.av.dataArray[i] / 256 * height / 2 - heightFromGround)
	        } else if (i > 83-5) {
            var lineHeight = this.av.dataArray[83-i] / 256 * height / 2;
	            this.av.p.lineTo(x - 13, height-heightFromGround)
	            // this.av.p.lineTo(x, height - lineHeight - heightFromGround)
              // this.av.p.lineTo(x + 12, height-heightFromGround)
	        } else if (i < 42) {
            var lineHeight = this.av.dataArray[i] / 256 * height / 2;
	            this.av.p.lineTo(x, height - lineHeight - heightFromGround)
              // this.av.p.lineTo(x, height - lineHeight - heightFromGround)
	        } else {
            var lineHeight = this.av.dataArray[83-i] / 256 * height / 2;
	            this.av.p.lineTo(x, height - lineHeight - heightFromGround)
              // this.av.p.lineTo(x, height - lineHeight - heightFromGround)
          }
	        x += this.width/porprpation;
        
	    }

      this.av.p.fillStyle = this.av.gradient;
	    this.av.p.fill();
	    this.av.p.closePath();

	    //左线条
	    this.av.p.beginPath();
	    this.av.p.moveTo(0, height-heightFromGround);
	    var x = 0;
	    for (var i = 1; i < 83; i++) {
	        var lineHeight
	        if (i < 5) {
            lineHeight = this.av.dataArray[i] / 256 * height / 2;
	            this.av.p.lineTo(x, height - this.av.dataArray[i] / 256 * height / 2 - leftLineHeightFromGround - Math.floor(Math.random() * bounceRange))
	        } else if (i > 83-5) {
            lineHeight = this.av.dataArray[83-i] / 256 * height / 2;
              this.av.p.lineTo(x - 13, height-heightFromGround)
	        } else if (i > 42){
            lineHeight = this.av.dataArray[83-i] / 256 * height / 2;
              this.av.p.lineTo(x, height - lineHeight - heightFromGround - Math.floor(Math.random() * bounceRange))
	        } else {
            lineHeight = this.av.dataArray[i] / 256 * height / 2;
              this.av.p.lineTo(x, height - lineHeight - heightFromGround - Math.floor(Math.random() * bounceRange))
          }
	        x += this.width/porprpation;
	    }
	    this.av.p.strokeStyle = this.av.gradient;
	    this.av.p.stroke();
	    this.av.p.closePath();


	    //清除左侧底部部分频谱
	    this.av.p.fillStyle = '#fff';
	    this.av.p.fillRect(0, 100, 470, 101);

	    //左倒影
	    this.av.p.beginPath();
	    this.av.p.moveTo(0, height-heightFromGround);
	    var x = 0;
	    for (var i = 1; i < 83; i++) {
	        if (i < 5) {
              var lineHeight = this.av.dataArray[i] / 256 * height / 6;
	            this.av.p.lineTo(x, this.av.dataArray[i] / 256 * height / 24 + 100)
	        } else {
            if(i<42) {
              var lineHeight = this.av.dataArray[i] / 256 * height / 6;
              this.av.p.lineTo(x, lineHeight + height-heightFromGround)
            } else {
              var lineHeight = this.av.dataArray[83-i] / 256 * height / 6;
              this.av.p.lineTo(x, lineHeight + height-heightFromGround)
            }
          }
	        x += this.width/porprpation;
	    }
	    this.av.p.lineTo(x - 12, height-heightFromGround)
	    this.av.p.fillStyle = '#21dd13';

	    this.av.p.shadowBlur = 20;
	    this.av.p.shadowColor = "#21dd13";
	    this.av.p.fill();
	    this.av.p.closePath();
	    this.av.p.shadowBlur = 0;

	    //辐射层透明，这样才能显示后面的频谱
	    this.av.penBg.globalAlpha = 0.2;

    },
    returnBackFn() {
      switch(this.isPlay) {
        case 'play':
        case 'playing':
        case 'load':
        // case 'loadauto':
        this.$emit('returnBack', 'pause');
        
        // window.cancelAnimationFrame(this.requestAnimationFrameID)
        break;
        case 'pause':
        case 'pauseing':
        this.$emit('returnBack', 'play');//同时isPlay也会改变
        // window.requestAnimationFrame(this.canvasDraw)
      }
    },
    returnBackMode(){
      switch(this.currentMode.name) {
        case 'order':
          this.currentMode = {name:'random',icon:'md-shuffle'};
          break;
        case 'random':
          this.currentMode = {name:'single',icon:'md-refresh-circle'};
          break;
        case 'single':
          this.currentMode = {name:'order',icon:'md-menu'};
          break;
        default:
          this.currentMode = {name:'order',icon:'md-menu'};
          break;

      }
      this.$emit('on-mode-change', this.currentMode.name);//同时isPlay也会改变
    },
    initPlayMode(){
      switch(this.$store.getters.playMode) {
        case 'order':
          this.currentMode = {name:'order',icon:'md-menu'};
          break;
        case 'random':
          this.currentMode = {name:'random',icon:'md-shuffle'};
          break;
        case 'single':
          this.currentMode = {name:'single',icon:'md-refresh-circle'};
          break;
        default:
          this.currentMode = {name:'order',icon:'md-menu'};
          break;
      }
    },
    _genImgUrl(arr) {
        let base64 = '';
        for (let i = 0; i < arr.length; i++) {
          if (Array.isArray(arr[i])) {
            generateUrl(arr[i]);
          } else {
            base64 += String.fromCharCode(arr[i]);
          }
        }
        return base64;
    },
    //改变播放进度
    changePlayerTime(value){
      this.audio.currentTime = parseInt(value)
      // this.$Message.info('changePlayerTime'+value)
    },
    //更新音乐海报
    updatedMusicPictrue(path){
      var albumImg = document.getElementById('album-img');
      new jsmediatags.Reader(path).setTagsToRead(['picture']).read({
        onSuccess: tag => {
          const pic = tag.tags.picture;
          if (pic) {
            const base64 = this._genImgUrl(pic.data);
            const url = `data:${pic.format};base64,${window.btoa(base64)}`;
            var _albumCoverImage = new Image(1, 1);
            const img = _albumCoverImage
            img.src = url;
            img.onload = () => {
              albumImg.style.backgroundImage = `url("${url}") `;
            };
          } else {
              albumImg.style.backgroundImage = `url(./src/renderer/assets/music_fire.jpg) `;
              this.$Message.info('没找到图片')
          }
        },
        onError: err => console.error(err)
      });
    },
    hideFormat () {
      return null;
    }

  },
  watch:{
    //写在上边 则相比较而言上边监听的先执行
    musicPath(val,oldval){
      while(this.isWatchisPlay);
      this.$Message.info('Watch musicPath:'+val)
      this.isWatchMusicPath = true;
      if( val !== '') {
        this.audio.pause();
        while(!this.audio.paused);
        if(this.audio.src !== this.musicPath) {
          this.audio.src = this.musicPath
          this.updatedMusicPictrue(val)
        }
        this.audio.load();
        if(['play','load','playing'].indexOf(this.isPlay)>=0 && this.audio.paused) {
          this.audio.play();//本应播放时未播放 则播放

          // this.canvasDraw()
        }

      }
      this.isWatchMusicPath = false;
    },
    isPlay(val,oldval) {
      while(this.isWatchMusicPath);
      this.isWatchisPlay = true;
      switch(val) {
        case "loadauto":
        case "load":
        case "play":
        if(this.audio.paused) {
          this.audio.play();
          // this.canvasDraw();
        }
        this.$Message.info('load()')
        this.$emit('returnBack', 'playing');
        requestAnimationFrame(this.canvasDraw)//关键
        break;
        case "pause":
        this.audio.pause();
        this.$emit('returnBack', 'pauseing');
        // cancelAnimationFrame(this.requestAnimationFrameID)
        break;
      }
      this.isWatchisPlay = false;
    },
    volume(val,oldval){
      this.audio.volume = val.toFixed(2)/100;
    }
  },
  mounted(){
      var albumImg = document.getElementById('album-img');
      albumImg.style.backgroundImage = `url(./src/renderer/assets/music_fire.jpg) `;
    // ipcRenderer.on('local-music-Send', (e, data) => {
    //   this.$$Message.info('local-music-Send'+data)
    // });

    this.canvasInit()
    // this.canvasDraw()
    const self = this
    this.audio.oncanplay = function () {  
      console.log('时长:',this.duration  )
      self.totalTime = this.duration
    }
    this.audio.ontimeupdate = function () {
      self.currentTime = self.audio.currentTime
    }
    this.audio.onended = function () {
      self.$emit('returnBack', 'overing');
      self.audio.currentTime = 0;
    }
    this.initPlayMode()
  }
}
</script>

<style scoped>
#album-img{
  width:100px;
  height:100px;
  background-size:100% 100%;
  /* display:inline-block; */
  float:left;
  margin-left:0px;
  bottom: 0;
  /* position: absolute;  */

}
#music-progress-bar{
  margin-left: 110px;
  margin-right: 10px;
  /* display: inline-block; */
  /* padding-left: 120px; */
  width:80%;
  /* float: right; */
  bottom: 0;
  position: absolute; 
  /* bottom: -30px; 
  left: 0; */
}
#play-pause{
  display: block;
  margin-left: 10px;
}
#play-mode{
  display: block;
  margin-left: 10px;
}
#play-volume{
  display: block;
  /* margin-left: 10px; */
}

  canvas {
      transition: background 5s, opacity 3s;
  }

</style>
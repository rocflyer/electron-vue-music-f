const state = {
    main: 0,
    localPath: [], //音乐路径
    musicFiles: [], //音乐文件 没有添加 删除 总是全部覆盖
    test: 111,
    winSize: [], //窗口大小 0-宽度 1-高度
    isPlay: 'pause', //是否播放
    currentMusic: { path: '', index: -1 },
    nextMusic: { path: '', index: -1 }, //下次播放路径
    playMode: 'order', //播放模式
}

function setNextMusic(state) {
    switch (state.playMode) {
        case "order":
            if (state.currentMusic.index + 1 >= state.musicFiles.length) {
                state.nextMusic = { path: state.musicFiles[0].path, index: 0 }
            } else {
                state.nextMusic = { path: state.musicFiles[state.currentMusic.index + 1].path, index: state.currentMusic.index + 1 }
            }
            break;
        case "random":
            var index = Math.ceil(Math.random() * (state.musicFiles.length - 1))
            state.nextMusic = { path: state.musicFiles[index].path, index: index }
            break;
        case 'single':
            state.nextMusic = state.currentMusic;
            break;
        default:
            if (state.currentMusic.index + 1 >= state.musicFiles.length) {
                state.nextMusic = { path: state.musicFiles[0].path, index: 0 }
            } else {
                state.nextMusic = { path: state.musicFiles[state.currentMusic.index + 1].path, index: state.currentMusic.index + 1 }
            }
            break;
    }
}

const mutations = {
    DECREMENT_MAIN_COUNTER(state) {
        state.main--
    },
    INCREMENT_MAIN_COUNTER(state) {
        state.main++
    },
    test(state, test) {
        state.test = test
    },
    addLocalPath(state, localPath) {
        if (state.localPath.indexOf(localPath) < 0) {
            state.localPath.push(localPath)
        }
    },
    clearLocalPath(state) {
        state.localPath = [];
    },
    deleteLocalPath(state, localPaths) {
        state.localPath = state.localPath.filter(function(item) {
            return localPaths.indexOf(item) < 0
        })
    },
    musicFiles(state, musicFiles) {
        state.musicFiles = []
        musicFiles.forEach(musicFile => {
            state.musicFiles.push(musicFile)
        });
        // state.musicFiles = musicFiles.concat()
    },
    winSize(state, winSize) {
        state.winSize = winSize;
    },
    isPlay(state, isPlay) {
        state.isPlay = isPlay;
    },
    currentMusic(state, currentMusic) {
        state.currentMusic = currentMusic
        setNextMusic(state)
    },
    nextMusic(state, nextMusic) {
        state.nextMusic = nextMusic
    },
    playMode(state, playMode) {
        state.playMode = playMode
        setNextMusic(state)
    },
    playNextMusic(state) {
        state.currentMusic = state.nextMusic
        setNextMusic(state)
    }
}

const actions = {
    someAsyncTask({ commit }) {
        // do something async
        commit('INCREMENT_MAIN_COUNTER')
    },
    setTest({ commit }, test) {
        commit('test', test)
    },
    addLocalPath({ commit }, addLocalPath) {
        commit('addLocalPath', addLocalPath)
    },
    //清空音乐路径
    clearLocalPath({ commit }) {
        commit('clearLocalPath')
    },
    //删除部分音乐路径
    deleteLocalPath({ commit }, localPaths) {
        commit('deleteLocalPath', localPaths)
    },
    //存储所有音乐文件
    setMusicFiles({ commit }, musicFiles) {
        commit('musicFiles', musicFiles)
    },
    setWinSize({ commit }, winSize) {
        commit('winSize', winSize)
    },
    setIsPlay({ commit }, isPlay) {
        commit('isPlay', isPlay)
    },
    setCurrentMusic({ commit }, currentMusic) {
        commit('currentMusic', currentMusic)
    },
    setNextMusic({ commit }, nextMusic) {
        commit('nextMusic', nextMusic)
    },
    setPlayMode({ commit }, playMode) {
        commit('playMode', playMode)
    },
    //这个指令比较特殊 讲下一个音乐文件发送至当前 并计算下一个
    playNextMusic({ commit }) {
        commit('playNextMusic')
    }
}

const getters = {
    localPath: state => {
        return state.localPath
    },
    test: state => {
        return state.test
    },
    musicFiles: state => {
        return state.musicFiles
    },
    winSize: state => {
        return state.winSize
    },
    isPlay: state => {
        return state.isPlay
    },
    currentMusic: state => {
        return state.currentMusic
    },
    nextMusic: state => {
        return state.nextMusic
    },
    playMode: state => {
        return state.playMode
    }
}



export default {
    state,
    mutations,
    actions,
    getters
}
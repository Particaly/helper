import { getType } from "@/library/Functional";
import anime from "animejs";
import Watcher from "@/library/Watcher";
/*
* 定义一些默认样式
* */
const uniform = {
	container: {
		width: '100%',
		height: '100%',
		position: 'relative',
		background: '#000000',
		// overflow: 'hidden'
	},
	video: {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
	},
	ctrlBar: {
		width: '100%',
		height: '50px',
		position: 'absolute',
		bottom: '0',
		left: '0',
		opacity: 1,
		background: '#0f0f0f',
		transition: 'all .5s',
		transform: 'translateY(100%)',
		boxShadow: '0 -1px 3px rgba(0,0,0,1)',
		display: 'flex',
		gridTemplateColumns: '50px 1fr 50px'
	},
	ctrlBarPlayBtn: {
		width: '50px',
		height: '50px',
		background: 'url()'
	},
	timeInfo: {
		minWidth: '150px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		color: 'white'
	},
	fullScreen: {
		minWidth: '50px'
	},
	playerProgressBar: {
		width: '100%', height: '5px', borderRadius: '2px',
		alignSelf: 'center', position: 'relative',
		cursor: 'pointer', padding: '10px 0'
	},
	playerProgressBarStyle: {
		width: '100%', height: '5px',borderRadius: '2px'
	},
	playerProgressTouchBlock: {
		width: '30px',height: '30px',borderRadius: '50%',
		position: 'absolute',top:' 50%',transform: 'translate(-50%, -50%)',cursor: 'pointer',
		display: 'flex',justifyContent: 'center',alignItems: 'center'
	},
	playerProgressTouchBlockInner: {
		width: '10px',height: '10px',borderRadius: '50%',background: 'rgba(255,255,255,1)'
	}
}
/*
* 为dom设置样式
* */
function setStyle(dom, uniformId) {
	let style = uniform[uniformId];
	if(style){
		let keys = Object.keys(style);
		keys.forEach(key => {
			dom.style[key] = style[key];
		});
		dom.setAttribute('id', uniformId);
	}
}
/*
* 播放按钮的dom
* */
function createSvgBtn(size) {
	const tempDom = document.createElement('div');
	tempDom.innerHTML = `
		<svg class="icon-play" style="cursor: pointer;margin-right: 15px"
			version="1.1"
			xmlns="https://www.w3.org/2000/svg"
			fill="white"
			width="${size}"
			height="${size}"
			viewBox="0 0 36 36"
			data-play="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z"
			data-pause="M 12,26 16.33,26 16.33,10 12,10 z M 20.66,26 25,26 25,10 20.66,10 z">
			<path d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z"></path>
		</svg>`;
	tempDom.firstElementChild.pathdata = [
		{
			value: 'M 12,26 16.33,26 16.33,10 12,10 z M 20.66,26 25,26 25,10 20.66,10 z'
		},
		{
			value: 'M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z'
		}
	];
	const play = tempDom.firstElementChild;
	tempDom.innerHTML = `
		<svg fill="white"
			class="icon"
			id="fullScreen"
			style="margin-right: 15px;cursor: pointer"
			viewBox="0 0 1024 1024"
			xmlns="http://www.w3.org/2000/svg"
			width="${size}"
			height="${size}">
		 	<path d="M85.333333 682.666667v128a128 128 0 0 0 128 128h128a42.666667 42.666667 0 0 0 0-85.333334H213.333333a42.666667 42.666667 0 0 1-42.666666-42.666666v-128a42.666667 42.666667 0 0 0-85.333334 0z m597.333334 256h128a128 128 0 0 0 128-128v-128a42.666667 42.666667 0 0 0-85.333334 0v128a42.666667 42.666667 0 0 1-42.666666 42.666666h-128a42.666667 42.666667 0 0 0 0 85.333334z m256-597.333334V213.333333a128 128 0 0 0-128-128h-128a42.666667 42.666667 0 0 0 0 85.333334h128a42.666667 42.666667 0 0 1 42.666666 42.666666v128a42.666667 42.666667 0 0 0 85.333334 0zM341.333333 85.333333H213.333333a128 128 0 0 0-128 128v128a42.666667 42.666667 0 0 0 85.333334 0V213.333333a42.666667 42.666667 0 0 1 42.666666-42.666666h128a42.666667 42.666667 0 0 0 0-85.333334z"></path>
		</svg>
	`;
	const fullScreen = tempDom.firstElementChild;
	return [play, fullScreen];
}
/*
* 播放进度条的dom
* */
function createProgressBar() {
	const playerProgressBar = document.createElement('div');
	const playerProgressBarStyle = document.createElement('div');
	const playerProgressTouchBlock = document.createElement('div');
	const playerProgressTouchBlockInner = document.createElement('div');
	setStyle(playerProgressBar,  'playerProgressBar');
	setStyle(playerProgressBarStyle, 'playerProgressBarStyle');
	setStyle(playerProgressTouchBlock, 'playerProgressTouchBlock');
	setStyle(playerProgressTouchBlockInner, 'playerProgressTouchBlockInner');
	playerProgressBar.appendChild(playerProgressBarStyle);
	playerProgressBarStyle.appendChild(playerProgressTouchBlock);
	playerProgressTouchBlock.appendChild(playerProgressTouchBlockInner);
	return playerProgressBar;
}
/*
* 初始化video事件
* */
function bindVideoEvent(target) {
	const video = target.$video;
	const $el = target.$el;
	let shouldUpdateProgress = false;
	function updateTime() {
		const timeInfo = $el.querySelector('#timeInfo');
		target.progress = (video.currentTime / video.duration).toFixed(4);
		timeInfo.innerText = `${filterTime(video.currentTime)} / ${filterTime(video.duration)}`;
	}
	function updateProgress() {
		if(shouldUpdateProgress){
			requestAnimationFrame(updateProgress);
		}
		target.progress = (video.currentTime / video.duration).toFixed(4);
	}
	if(target.autoPlay){
		video.setAttribute('autoplay', 'autoplay');
	}
	if(target.muted){
		video.setAttribute('muted',target.muted);
	}
	if(target.loop){
		video.setAttribute('loop', true);
	}
	video.addEventListener('durationchange', updateTime);
	video.addEventListener('timeupdate', updateTime);
	video.addEventListener('ended', () => {
		target.status = 0;
		shouldUpdateProgress = false;
	});
	video.addEventListener('play', () => {
		target.status = 1;
		shouldUpdateProgress = true;
		updateProgress();
	});
	video.addEventListener('pause', () => {
		target.status = 0;
		shouldUpdateProgress = false;
	});
	const fullScreen = $el.querySelector('#fullScreen');
	if(fullScreen){
		fullScreen.addEventListener('click', () => {
			const element = video;
			if (element.requestFullScreen) {
				element.requestFullScreen();
			} else if (element.webkitRequestFullScreen) {
				element.webkitRequestFullScreen()
			} else if (element.mozRequestFullScreen) {
				element.mozRequestFullScreen()
			} else if (element.oRequestFullScreen) {
				element.oRequestFullScreen()
			} else if (element.msRequestFullScreen) {
				element.msRequestFullScreen()
			}
		})
	}
}
/*
* 格式化播放时间
* */
function filterTime(seconds) {
	const m = (Math.floor(seconds/60)+'').padStart(2, 0);
	const s = (Math.ceil(seconds%60)+'').padStart(2, 0);
	return m + ':' + s
}

export default class Player extends Watcher{
	constructor(options) {
		// 监听status的值，data中的数据会被定义到当前的this上，直接修改值会触发watch
		super({
			data: {
				status: 0,      // 0: 停止播放 | 1： 正在播放 | 2： 正在加载
				progress: 0,
				type: 'file',   // live 直播 | file 视频文件
			},
			watch: {
				status: function (newVal, oldVal) {
					const target = this;
					target.triggerPlayBtn(newVal, oldVal);
				},
				type: function (newVal, oldVal) {
					const target = this;
					target.triggerPlayType(newVal, oldVal);
				},
				progress: function (newVal, oldVal) {
					const target = this;
					target.triggerUpdateProgress(newVal, oldVal);
				}
			}
		});
		this.options = options;
		this.$el = options.dom;
		this.$video = undefined;
		this.$container = undefined;
		this.loop = options.loop;
		this.muted = options.muted;
		this.buildCtrl = options.buildCtrl === undefined ? true : options.buildCtrl;
		this.wsUrl = options.wsUrl;
		this.videoUrl = options.rtspUrl;
		this.autoPlay = options.autoPlay;
		this.isPlaying = false;
		this.isStoped = true;
		this.handleBox = {
			data: [],   // 接收到数据的事件监听
			error: [],  // 内部错误的事件监听
		}
		this.handledKeys = Object.keys(this.handleBox);
		
		this.init();
		this.type = 'live';
	}
	
	triggerPlayBtn(newVal, oldVal) {
		if(newVal === 1 && oldVal === 0 && this.$playBtn){
			anime({
				targets: this.$playBtn.firstElementChild,
				d: [...this.$playBtn.pathdata].reverse(),
				easing: 'easeOutQuad',
				duration: 100
			});
			if(this.type === 'file'){
				this.$video.play();
			}
		}else if(newVal === 0 && oldVal === 1 && this.$playBtn){
			anime({
				targets: this.$playBtn.firstElementChild,
				d: this.$playBtn.pathdata,
				easing: 'easeOutQuad',
				duration: 100
			});
			if(this.type === 'file'){
				this.$video.pause();
			}
		}
	}
	
	triggerPlayType(newVal, oldVal) {
		if(this.buildCtrl){
			if(newVal === 'file'){
				let el = this.$el.querySelector('#playerProgressBar');
				el.style.display = 'block';
			}else if(newVal === 'live'){
				let el = this.$el.querySelector('#playerProgressBar');
				el.style.display = 'none';
			}
		}
	}
	
	triggerUpdateProgress(newVal) {
		console.log(newVal);
		const progressBg = this.$el.querySelector('#playerProgressBarStyle');
		const touchBlock = this.$el.querySelector('#playerProgressTouchBlock');
		if(touchBlock){
			touchBlock.style.left = newVal*100 + '%';
			const linear = `linear-gradient(to right,rgba(255,255,255,.7) 0% ,rgba(255,255,255,.7) ${newVal*100}%,rgba(255,255,255,.3) ${newVal*100+0.01}%,rgba(255,255,255,.3) 100%)`;
			progressBg.style.backgroundImage = linear;
			console.log(progressBg.style.backgroundImage);
			console.log(linear);
		}
	}
	
	init() {
		/*
		* 注入相关dom到页面容器中
		* */
		const container = document.createElement('div');
		const video = document.createElement('video');
		container.appendChild(video);
		setStyle(container, 'container');
		setStyle(video, 'video');
		
		this.$el.appendChild(container);
		this.$video = video;
		this.$container = container;
		if(this.buildCtrl){
			// 整个下方控制横幅
			const ctrlBar = document.createElement('div');
			setStyle(ctrlBar, 'ctrlBar');
			// 播放按钮
			const [playBtn, fullScreen] = createSvgBtn(50);
			this.$playBtn = playBtn;
			ctrlBar.appendChild(playBtn);
			// 临时的点击事件，或许可以被重写；
			playBtn.addEventListener('click', () => {
				if(this.status === 0){
					this.status = 1
				}else{
					this.status = 0
				}
			})
			const progressBar = createProgressBar();
			ctrlBar.appendChild(progressBar);
			const timeInfo = document.createElement('div');
			setStyle(timeInfo,  'timeInfo');
			ctrlBar.appendChild(timeInfo);
			ctrlBar.appendChild(fullScreen);
			
			container.appendChild(ctrlBar);
			
			
			
			
			// 为播放进度条添加鼠标移入就从底部上浮的动作；
			let ctrlBar_Timer;
			// container.addEventListener('mousemove', () => {
			// 	ctrlBar.style.transform = 'translateY(0)';
			// 	ctrlBar.style.opacity = 1;
			// 	clearTimeout(ctrlBar_Timer);
			// 	ctrlBar_Timer = setTimeout(() => {
			// 		ctrlBar.style.transform = 'translateY(100%)';
			// 		ctrlBar.style.opacity = 0;
			// 	}, 2000);
			// })
			// -----------------------------------------
		}
		
		// 绑定事件
		bindVideoEvent(this);
		
		if(this.autoPlay){
			this.play(this.videoUrl, this.type);
		}
	}
	
	play(url, type) {
		this.type = type;
		if(type === 'live'){
		
		}else if(type === 'file'){
			this.$video.setAttribute('src', url);
		}
	}
	
	dispatch(eventType, ...args) {
		if(this.handledKeys.includes(eventType)){
			let handlers = [...this.handleBox[eventType]];
			handlers.forEach(handler => handler(...args));
		}
	}
	on(eventType, handler) {
		if(this.handledKeys.includes(eventType)){
			this.handleBox[eventType].push(handler);
		}
	}
	off(eventType, handler) {
		if(this.handledKeys.includes(eventType)){
			const index = this.handleBox[eventType].findIndex(item => item === handler);
			if(index !== -1){
				this.handleBox[eventType].splice(index, 1);
			}
		}
	}
}



// 获取目标的类型
function getType(target) {
	if (Object.is(target, NaN)) {
		return 'nan';
	} else if (Object.is(target, Infinity)) {
		return 'infinity';
	}
	let res = Object.prototype.toString.call(target).slice(8, -1);
	return res.toLowerCase();
}

// 奇怪的打印工具
function log(info, type = 'warn') {
	if (getType(info) === 'string') {
		let arr = info.split('\n');
		info = arr.join('\n🐌  ');
	}
	let len = info.length;
	if (len > 75) {
		len = 75;
	}
	console[type](`%c
  /‾‾${'‾'.repeat(len)}
🐌 ${info}
  \\__${'_'.repeat(len)}
`, 'font-size: 16px;');
}
// 使用$$来代替jq选择器
function use$$() {
	window.$$ = function (select) {
		let res = document.querySelectorAll(select);
		if(res.length === 1){
			res = res[0];
		}
		return res;
	};
}
function random(min,max,isZ=true){
	if(getType(min) === 'array'){
		const length = min.length;
		if(length>0){
			return min[random(0, length - 1)];
		}else{
			return min[0];
		}
	}
	if(min === 'repeat'){
		min = max[0];
		let length = max[2];
		max = max[1];
		let res = [];
		for(let i = 0; i < length;i++){
			res.push(random(min,max,isZ))
		}
		return res;
	}
	if(min === 'color'){
		return randomColor();
	}
	if(min === 'id'){
		return randomId(max);
	}
	if(isZ){
		return Math.floor(Math.random()*(max-min+1)+min);
	}else{
		return Math.random()*(max-min)+min;
	}
}

function randomColor(param) {
	if(getType(param) === 'array'){
		const length = param.length;
		if(length>0){
			return param[random(0,length-1)]
		}else{
			return randomRgbColor()
		}
	}else{
		return randomRgbColor()
	}
}

function randomId(num = 18){
	var returnStr = "",
		charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for(var i=0; i<num; i++){
		if(i===0){returnStr+='P';continue}
		var index = Math.round(Math.random() * (charStr.length-1));
		returnStr += charStr.substring(index,index+1);
	}
	return returnStr;
}

function randomRgbColor() { //随机生成RGB颜色
	var r = Math.floor(Math.random() * 256); //随机生成256以内r值
	var g = Math.floor(Math.random() * 256); //随机生成256以内g值
	var b = Math.floor(Math.random() * 256); //随机生成256以内b值
	return `rgb(${r},${g},${b})`; //返回rgb(r,g,b)格式颜色
}

function almostEqualString(targetA, targetB, leastRate) {
	targetA = targetA + '';
	targetB = targetB + '';
	targetA = targetA.split('');
	let length = targetA.length;
	let count = 0;
	targetA.map((item) => {
		if(targetB.includes(item)){
			count += 1;
		}
	})
	return count/length*100 > leastRate;
}

function insertSpanToString(word,highlightOptions) {
	let res = '';
	let pointerIndex = 0;
	let tempStr = word;
	if(Array.isArray(highlightOptions)){
		highlightOptions.forEach((highlightrule) => {
			let highlightruleArray = highlightrule.split('*');
			let startIndex = undefined,endIndex = 0;
			let returnFlag = false;
			highlightruleArray.forEach((rule) => {
				let indexArray = findAllIndex(tempStr, rule);
				if(indexArray.length === 0||returnFlag){
					returnFlag = true;
					return false;
				}
				let index;
				if(indexArray.length === 1){
					index = indexArray[0];
					if(startIndex === undefined){
						startIndex = index;
					}
				}else{
					indexArray.some(item=>{
						index = item;
						if(startIndex === undefined){
							startIndex = item;
						}
						return item >= startIndex;
					})
				}
				endIndex = index + rule.length;
				pointerIndex = endIndex;
			});
			if(returnFlag){return false}
			let subs = tempStr.slice(startIndex,endIndex);
			tempStr = tempStr.split(subs);
			res += tempStr.shift() + '<span>' + subs + '</span>';
			tempStr = tempStr.join(subs);
		})
		res += tempStr;
		return res;
	}
}

function findAllIndex(string, item, arr = [], long = 0) {
	let index = string.indexOf(item);
	if(index !== -1){
		let str = string.slice(index+item.length, string.length);
		index += long;
		arr.push(index);
		long = index + item.length;
		return findAllIndex(str, item, arr, long)
	}else{
		return arr;
	}
}

export {
	log, use$$, getType,randomColor,randomRgbColor,randomId,random,almostEqualString,
	insertSpanToString,
}

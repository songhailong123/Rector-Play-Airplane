!(function(window, document) {
	//重复代码有些懒得压缩了，比如根据得分更改背景图和弹话框，老师说要有 一定代码量就凑行数吧哈哈哈哈
	//简单选择器函数。
	function $get(attr) {
		return document.querySelector(attr);
	}
	//手机端防止网页缩放
	(function() {
		var width = document.documentElement.clientWidth;
		var head = $get("head");
		var frame = document.createDocumentFragment();
		var meta = document.createElement("meta");
		meta.content = "width=device-width,initial-scale=1.0,maximum-scale=1.0, user-scalable=0"
		meta.name = "viewport";
		frame.appendChild(meta);
		if(width < 1024) {
			head.appendChild(frame);
		}
	})();
	//手机端布局设置rem
	function change() {
		var num;
		var width = document.documentElement.clientWidth;
		if(width < 1024) {
			num = 32;
		} else {
			num = 16
		}
		document.documentElement.style.fontSize = num * document.documentElement.clientWidth / 320 + 'px';
	}
	change();
	window.addEventListener('resize', change, false);
	//根据可视区屏幕宽度设置地图高度实现自适应高度
	var getHeight = (function() {
		var oheight = document.documentElement.clientHeight;
		var ohead = $get("header").offsetHeight;
		var height = oheight - ohead;
		$get(".map").style.cssText += "height:" + height + "px;";
		$get(".num").style.cssText += "margin-top:" + oheight * 0.2 + "px";
	})();
	//禁止选中图片防止点击蓝图
	(function() {
		//禁止鼠标右键
		document.oncontextmenu = function() {
			return false;
		};
		//禁止选中图片
		document.onselectstart = function() {
			return false;
		};
	})();
	//设置遮罩层倒计时，用于准备以及dom加载
	var begin = (function() {
		var num = 3;
		var flag = false;
		var t = null;
		var x = $get("#b").innerHTML;
		$get("#c").innerHTML = "你着什么急等一会";
		//查找数组中的最大值
		function maxNum(arr) {
			var max = parseInt(arr[0]);
			for(var i = 0; i < arr.length; i++) {
				max = max < parseInt(arr[i + 1]) ? parseInt(arr[i + 1]) : max;
			}
			console.log(max);
			return max;
		}
		//游戏倒计时函数以及记录最高分
		var number = [];

		function move() {
			x--;
			$get("#b").innerHTML = x;
			if(x <= 10) {
				$get("#b").style.color = "#FF3030";
			} else {
				$get("#b").style.color = "#B23AEE";
			}
			if(x <= 0) {
				clearInterval(t);
				$get(".ready").style.cssText += "display: block;";
				var score = $get("#a").innerHTML;
				number.push(score);
				var last = maxNum(number);
				console.log(typeof last);
				console.log(number + "=====" + last);
				$get("#d").innerHTML = last;
				if(score <= 70) {
					$get("#panda").setAttribute("src", "img/img3.png");
					$get(".map").style.cssText += "background: url(img/bg1.png) no-repeat;background-size:100% 100%;";
					$get("#c").innerHTML = "这手速有空多练练吧:" + score + "分";
				} else if(score >= 100) {
					$get(".map").style.cssText += "background: url(img/bg2.png) no-repeat;background-size:100% 100% ;";
					$get("#panda").setAttribute("src", "img/img2.png");
					$get("#c").innerHTML = "高手高手:" + score + "分";
				} else {
					$get(".map").style.cssText += "background: url(img/bg.png) no-repeat;background-size:100% 100%;";
					$get("#panda").setAttribute("src", "img/img4.png");
					$get("#c").innerHTML = "年轻人你还需要力量:" + score + "分";
				}
			}
		}
		//设置遮罩层得倒计时
		var timer = setInterval(function step() {
			$get("#c").innerHTML = "等着" + num;
			num--;
			var t = null;
			if(num < 0) {
				flag = true;
				clearInterval(timer);
				$get(".ready").style.cssText += "display: none;";
			}
		}, 1000);
		t = setInterval(move, 1000);
		//点击确认按钮后重新加载游戏以及暂停功能
		$get(".confirm").addEventListener("click", function() {
			if(x <= 0) {
				clearInterval(t);
				$get(".ready").style.display = "none";
				$get("#a").innerHTML = 0;
				x = 60;
				t = setInterval(move, 1000);
			} else {
				//暂停
				clearInterval(timer);
				clearInterval(t);
				$get(".ready").style.display = "none";
				$get("#img").setAttribute("src", "img/pause.png");
				t = setInterval(move, 1000);
			}
		});
		//暂停时切换图片以及显示遮罩层，防止.map点击
		$get(".button").addEventListener("click", function() {
			var oimg = $get("#img");
			clearInterval(t);
			t = null;
			$get(".ready").style.display = "block";
			$get("#c").innerHTML = "已暂停点击开始";
			oimg.setAttribute("src", "img/begin.png");
		});
		//点击重新开始
		var remake = (function() {
			$get(".remake").addEventListener("click", function() {
				clearInterval(t);
				x = 60;
				$get("#a").innerHTML = 0;
				t = setInterval(move, 1000);
			});
		})();
	})();
	//运动函数,不包括opacity以及z-index
	function getStyle(element, attr) {
		return window.getComputedStyle ? window.getComputedStyle(element, null)[attr] :
			element.currentStyle[attr] || 0;
	}

	function animate(element, json, fn) {
		clearInterval(element.timer);
		element.timer = setInterval(function change() {
			var flag = true;
			for(var attr in json) {
				//获取当前元素属性值，并且转化为整形
				var current = parseInt(getStyle(element, attr));
				//获取目标属性值，即为json中传入得属性值
				var target = json[attr];
				//设置每次移动的步数,目标值与当前值得差值*0.
				var step = (target - current) / 5;
				//小于0向上取整，大于0向下取整
				step = step > 0 ? Math.ceil(step) : Math.floor(step);
				//每次移动后的当前值
				current += step;
				element.style[attr] = current + "px";
				if(current != target) {
					flag = false;
				}
			}
			if(flag) {
				clearInterval(element.timer);
				if(fn) {
					fn();
				}
			}
		}, 5);
	}
	//设置热狗的发射目标值以及速度
	var hotdog = (function() {
		$get(".map").addEventListener("mousedown", function(e) {
			var e = window.e || e;
			e.stopPropagation();
			var left = e.clientX, //调整热狗的位置
				top = e.clientY,
				oleft = parseInt(($get(".hotdog"), "left")),
				otop = parseInt(getStyle($get(".hotdog"), "top")),
				owidth = $get(".hotdog").offsetWidth,
				oheight = $get(".hotdog").offsetHeight;
			x = left - owidth,
				y = top - oheight;
			animate($get(".hotdog"), {
				"left": x,
				"top": y
			}, function() {
				$get(".hotdog").style.cssText = "left:" + oleft + ";top:" + otop + ";";
			});
		});
	})();
	//自动随机生成飞机
	(function() {
		var array = [];

		function air() {
			var fragment = document.createDocumentFragment();
			var odiv = document.createElement("div");
			odiv.className = "airplane";
			odiv.style.cssText += "width: 2rem;height: 1.6rem;";
			fragment.appendChild(odiv);
			$get(".map").appendChild(fragment);
			var width = parseInt(odiv.offsetWidth),
				height = parseInt(odiv.offsetHeight);
			var num = parseInt(Math.random() * 4);
			var x = parseInt(Math.random() * ($get(".map").offsetWidth / width) - 1) * width;
			y = parseInt(Math.random() * ($get(".map").offsetHeight / height) - 1) * height;
			odiv.style.cssText += "position:absolute;left:" + x + "px;top:" + y + "px;background: url(img/air" + num + ".png) no-repeat;background-size:100% 100%;";
			array.push(odiv);
		}
		//删除飞机
		(function remove() {
			air();
			for(var i = 0; i < array.length; i++) {
				array[i].addEventListener("mousedown", function() {
					var s = $get("#a"),
						num = s.innerHTML;
					num++;
					s.innerHTML = num;
					this.style.cssText += "display:none;";
					this.parentNode.removeChild(this);
					array.splice(i, 1);
					remove(); //递归实现 点击删除然后刷新下一个飞机
				});
			}
		})();
	})();
})(window, document);
class Snake {
	/**
	 * @param {number} size
	 * @param {number} width
	 * @param {number} height
	 * @param {number} gap
	 * @param {string} mapName
	 * @param {number} speed
	 */
	constructor(size, width, height, gap, mapName, speed) {
		// 获取地图元素
		/**
		 * @type {HTMLDivElement}
		 */
		this.map = document.querySelector(mapName);
		// 复制参数至成员
		this.size = size;
		this.gap = gap;
		this.speed = speed;
		this.width = width;
		this.height = height;
		// 初始化蛇的身体数组
		this.bodys = [
			{
				x: 3,
				y: 1,
			},
			{
				x: 2,
				y: 1,
			},
			{
				x: 1,
				y: 1,
			},
		];
		// console.log(this.bodys);
		this.direction = [1, 0];
		this.isPause = false;
		this.isGameOver = false;
		this.init_ui();
		this.init_game();
	}
	/**
	 * 初始化UI的函数
	 */
	init_ui() {
		this.map.style.width = `${this.width * this.size}px`;
		this.map.style.height = `${this.height * this.size}px`;
		console.log(this.bodys);
		this.bodys.forEach((v, i) => {
			const node = document.createElement("div");
			node.className = "snake-body";
			node.style.setProperty("--x", `${v.x * this.size}px`);
			node.style.setProperty("--y", `${v.y * this.size}px`);
			node.style.setProperty("--size", `${this.size}px`);
			node.setAttribute("date-index", i);
			this.map.appendChild(node);
		});
		let food = document.createElement("div");
		this.createFood();
		food.style.setProperty("--x", `${this.food[0] * this.size}px`);
		food.style.setProperty("--y", `${this.food[1] * this.size}px`);
		food.className = "food";
		this.map.appendChild(food);
	}
	init_game() {
		this.init_key();
		let { speed } = this;
		this.timer = setInterval(() => {
			this.move();
		}, speed);
	}
	/**
	 * 移动函数
	 */
	move() {
		this.check();
		// 初始化移动后的身体
		let movedBody = [];
		// 初始化成对象
		for (let i = 0; i < this.bodys.length; i++) {
			movedBody[i] = {};
		}
		movedBody[0].x = this.bodys[0].x + this.direction[0];
		movedBody[0].y = this.bodys[0].y + this.direction[1];
		for (let i = 1; i < this.bodys.length; i++) {
			movedBody[i].x = this.bodys[i - 1].x;
			movedBody[i].y = this.bodys[i - 1].y;
		}
		for (let i in movedBody) {
			this.bodys[i] = movedBody[i];
		}
		this.updateView();
	}
	updateView() {
		let bodys = document.querySelectorAll(".snake-body");
		let food = document.querySelector(".food");
		for (let i = 0; i < bodys.length; i++) {
			bodys[i].style.setProperty("--x", `${this.bodys[i].x * this.size}px`);
			bodys[i].style.setProperty("--y", `${this.bodys[i].y * this.size}px`);
		}
		food.style.setProperty("--x", `${this.food[0] * this.size}px`);
		food.style.setProperty("--y", `${this.food[1] * this.size}px`);
	}
	init_key() {
		document.onkeyup = (e) => {
			switch (e.key) {
				case " ":
					let { speed } = this;
					if (this.isPause && !this.isGameOver) {
						this.isPause = false;
						this.timer = setInterval(() => {
							this.move();
						}, speed);
					} else {
						this.isPause = true;
						clearInterval(this.timer);
					}
					console.log(this.isGameOver);
					if (this.isGameOver) {
						location.reload(true);
					}
					break;
				case "ArrowLeft":
					this.direction = [-1, 0];
					break;
				case "ArrowUp":
					this.direction = [0, -1];
					break;
				case "ArrowRight":
					this.direction = [1, 0];
					break;
				case "ArrowDown":
					this.direction = [0, 1];
					break;
			}
		};
	}
	createFood() {
		this.food = [
			Math.floor(Math.random() * this.width),
			Math.floor(Math.random() * this.height),
		];
	}
	addBody() {
		let { bodys, direction } = this;
		this.bodys.push({
			x: bodys[bodys.length - 1].x - direction[0],
			y: bodys[bodys.length - 1].y - direction[1],
		});
		let len = this.bodys.length;
		let body = document.createElement("div");
		body.className = "snake-body";
		body.style.setProperty("--x", `${this.bodys[len - 1].x * this.size}px`);
		body.style.setProperty("--y", `${this.bodys[len - 1].y * this.size}px`);
		this.map.appendChild(body);
	}
	check() {
		let header = this.bodys[0];
		if (
			header.x > this.width ||
			header.y > this.height ||
			header.x < 0 ||
			header.y < 0
		) {
			clearInterval(this.timer);
			this.isGameOver = true;
		}
		if (header.x == this.food[0] && header.y == this.food[1]) {
			this.addBody();
			this.createFood();
		}
	}
}

window.onload = () => {
	new Snake(20, 20, 20, 150, ".map", 150);
};

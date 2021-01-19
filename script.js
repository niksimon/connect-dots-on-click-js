window.onload = function(){
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		width = canvas.width = window.innerWidth,
		height = canvas.height = window.innerHeight,
		nBalls = 50,
		mouseX = mouseY = 0,
		mouseClick = false;

	context.lineWidth = 0.1;

	document.addEventListener("mousemove", function(event){
		mouseX = event.clientX;
		mouseY = event.clientY;
	});
	document.addEventListener("mousedown", function(){ mouseClick = true; });
	document.addEventListener("mouseup", function(){ mouseClick = false; });

	var ball = function(id, x, y, radius){
		this.id = id;
		this.position = {
			x: x,
			y: y
		},
		this.velocity = {
			x: randomRange(-2, 2),
			y: randomRange(-2, 2)
		};
		this.radius = radius;
		this.color = "rgba(243, 53, 53, 1)";
		this.selected = false;
		this.connectedTo = null;
		this.update = function(){
			if(this.position.x <= this.radius)
				this.velocity.x = -this.velocity.x;
			else if(this.position.x >= width - this.radius)
				this.velocity.x = -this.velocity.x;
			else if(this.position.y <= this.radius)
				this.velocity.y = -this.velocity.y;
			else if(this.position.y >= height - this.radius)
				this.velocity.y = -this.velocity.y;

			if(this.connectedTo != null){
				console.log("connected");
				this.drawLine();
			}

			for(var i = 0.03, j = 6; i < 0.061; i += 0.02, j--){
				context.fillStyle = "rgba(243, 53, 53, " + i + ")";
				context.beginPath();
				context.arc(this.position.x, this.position.y, this.radius + j, 0, Math.PI * 2, false);
				context.fill();
			}

			if(pointCircleCollision(this) || this.selected)
				this.color = "#ffcf5e";
			else
				this.color = "rgba(243, 53, 53, 1)";

			context.fillStyle = this.color;
			context.beginPath();
			context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
			context.fill();

			this.position.x += this.velocity.x;
			this.position.y += this.velocity.y;
		};
		this.drawLine = function(){
			context.strokeStyle = "#fff";
			context.beginPath();
			context.moveTo(this.position.x, this.position.y);
			context.lineTo(this.connectedTo.position.x, this.connectedTo.position.y);
			context.stroke();
		};
	};

	function pointCircleCollision(circle){
		return Math.sqrt((circle.position.x - mouseX) * (circle.position.x - mouseX) + (circle.position.y - mouseY) * (circle.position.y - mouseY)) <= circle.radius;
	}

	function randomRange(min, max){
		return Math.random() * (max - min) + min;
	}

	var balls = [];
	for(var i = 0; i < nBalls; i++)
		balls.push(new ball(i, randomRange(30, width - 30), randomRange(10, height - 10), randomRange(10, 20)));

	var selectedBall = -1;

	function update(){
		context.clearRect(0, 0, width, height);
		context.fillStyle = "#343434";
		context.fillRect(0, 0, width, height);

		for(var i = 0; i < nBalls; i++){
			if(pointCircleCollision(balls[i]) && mouseClick){
				if(selectedBall == -1){
					balls[i].selected = true;
					selectedBall = balls[i].id;
				}
				else if(selectedBall != balls[i].id){
					console.log("yes");
					balls[selectedBall].connectedTo = balls[i];
					balls[selectedBall].selected = false;
					balls[i].selected = false;
					selectedBall = -1;
				}
			}
			
			balls[i].update();
		}
		
		requestAnimationFrame(update);
	}

	update();
}
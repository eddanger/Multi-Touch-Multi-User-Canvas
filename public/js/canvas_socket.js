var body, canvas, ctx, socket, coords, last_coords, touchdown;

$(document).ready(function() {
	setup_canvas();
	happyFace();
	setup_socket();
	setup_ios();
});

function setup_socket() {
	socket = new io.Socket(null, { 
		port: 8080,
		rememberTransport: false
	});

	socket.connect();
	
	socket.on('message', function(message) {
		if ('c' in message) {
			receive_coordinates(message);
		}
		
		if ('online' in message) {
			receive_online_status(message);
		}
	});

	receive_coordinates = function(message) {
		coords = message.c;
		
		for (var i = 0; i < coords.length; i++)
		{
			current_socket_coords = {
				x:coords[i].current.x,
				y:coords[i].current.y,
			};

			last_socket_coords = {
				x:coords[i].last.x,
				y:coords[i].last.y,
			};

			drawLine("#FF00FF", current_socket_coords, last_socket_coords);
			drawCircle("#FF8040", current_socket_coords);
		}
	};

	receive_online_status = function(message) {
		if (message.online == 1)
		{
			$('.listening').html("Nobody else is here. Give it a minute or two, someone might arrive.");
		}
		else
		{
			$('.listening').html(message.online + " people are drawing.");
		}
	};
};

function setup_ios()
{
	// hide the toolbar in iOS
	setTimeout(function() { window.scrollTo(0, 1); }, 100);

	// prevents dragging the page in iOS	
	body.ontouchmove = function(e)
	{
		e.preventDefault();
	};
}

function setup_canvas()
{
	body = document.querySelector("body");
	canvas = document.querySelector('canvas');
	ctx = canvas.getContext('2d');
	
	// iOS
	canvas.ontouchmove = function(e) {
		coords = [];
		
		for (var i=0; i < e.targetTouches.length; i++) {
			var current_coords = {
				x: e.targetTouches[i].clientX,
				y: e.targetTouches[i].clientY
			};
			
			if (!last_coords)
			{
				var last_coords_for_index = []
			}
			else
			{
				var last_coords_for_index = {
					x: last_coords[i].x,
					y: last_coords[i].y
				}
			}

			coords.push({
				current: current_coords,
				last: last_coords_for_index
			});
		}
		
		move(coords);

		last_coords = [];
		for (var i=0; i < coords.length; i++) {
			last_coords.push(coords[i].current);
		}
	};
	
	canvas.ontouchend = function(e) {
		last_coords = null;
	};
	
	// typical draw evemt for desktop 
	canvas.onmousemove = function(e) {
	
		if (touchdown) {
			if (!last_coords)
			{
				last_coords = [];
			}

			var current_coords = {
				x:e.clientX - e.target.offsetLeft + window.scrollX,
				y:e.clientY - e.target.offsetTop + window.scrollY
			}
			
			coords = [{
				current: current_coords,
				last: last_coords
			}];
			
			//$('.debug').html('coords: ' + current_coords.x + " " + current_coords.y );
			
			move(coords);

			last_coords = current_coords;
		}
	};
	
	canvas.onmouseup = function(e) {
 		last_coords = null;
		//$('.debug').html('');
	};

	body.onmouseup = function(e) {
		touchdown = false;
		last_coords = null;
	};
		
	body.onmousedown = function(e) {
		touchdown = true;
	};

}

function drawLine(color, coords, last_coords)
{
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(coords.x,coords.y);
	if (last_coords.x)
	{
		ctx.lineTo(last_coords.x,last_coords.y);
	}
	ctx.closePath();
	ctx.stroke();
}

function drawCircle(color, coords)
{
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.moveTo(coords.x,coords.y);
	ctx.arc(coords.x, coords.y, 3, 0,  Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
}

function send(coords)
{
	socket.send({c: coords});
}

function move(coords)
{
	for (var i = 0; i < coords.length; i++)
	{
		var current_coords = {
			x:coords[i].current.x,
			y:coords[i].current.y,
		};

		var last_coords = {
			x:coords[i].last.x,
			y:coords[i].last.y,
		};

		drawLine("#0000ff", current_coords, last_coords);
		drawCircle("#ff0000", current_coords);
	}

	send(coords);
}

function happyFace()
{
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = "#FFFF00";
	ctx.beginPath();
	ctx.arc(100,100,50,0,Math.PI*2,true);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();

	// Add 2 green eyes					
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = "#FFFFFF";
	ctx.beginPath();
	ctx.arc(80,80,8,0,Math.PI*2,true);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();

	ctx.fillStyle = "#009966";
	ctx.beginPath();
	ctx.arc(80,80,5,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
	
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = "#FFFFFF";
	ctx.beginPath();
	ctx.arc(120,80,8,0,Math.PI*2,true);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
	
	ctx.fillStyle = "#009966";
	ctx.beginPath();
	ctx.arc(120,80,5,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();

	// Add the smile					
	ctx.strokeStyle = "#000000";
	ctx.beginPath();
	ctx.moveTo(70,110);
	ctx.quadraticCurveTo(100,150,130,110);
	ctx.quadraticCurveTo(100,150,70,110);				
	ctx.closePath();
	ctx.stroke();
}

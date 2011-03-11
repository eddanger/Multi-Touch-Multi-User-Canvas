var body, canvas, ctx, socket, coords, last_coords, touchdown;

$(document).ready(function() {
	setup_canvas();
	setup_socket();
	setup_ios();
});

function setup_socket() {
	socket = new io.Socket(null, { 
		port: 8080
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
			current_coords = {
				x:coords[i].current.x,
				y:coords[i].current.y,
			};

			last_coords = {
				x:coords[i].last.x,
				y:coords[i].last.y,
			};

			drawLine("pink", current_coords, last_coords);
			drawCircle("orange", current_coords);
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
			
			move(coords);

			last_coords = current_coords;
		}
	};
	
	canvas.onmouseup = function(e) {
 		last_coords = null;
	};

	window.onmouseup = function(e) {
		touchdown = false;
	};
		
	window.onmousedown = function(e) {
		touchdown = true;
	};

}

function drawLine(color, coords, last_coords)
{
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(coords.x,coords.y);
	ctx.lineTo(last_coords.x,last_coords.y);
	ctx.closePath();
	ctx.stroke();
}

function drawCircle(color, coords)
{
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.moveTo(coords.x,coords.y);
	ctx.arc(coords.x, coords.y, 3, 0,  Math.PI*2, true);
	ctx.fill();
	ctx.closePath();
}

function send(coords)
{
	socket.send({c: coords});
}

function move(coords)
{
	for (var i = 0; i < coords.length; i++)
	{
		current_coords = {
			x:coords[i].current.x,
			y:coords[i].current.y,
		};

		last_coords = {
			x:coords[i].last.x,
			y:coords[i].last.y,
		};

		drawLine("blue", current_coords, last_coords);
		drawCircle("red", current_coords);
	}

	send(coords);
}

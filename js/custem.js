let loaded = false;
let clicked = -1;
let lastClicked = -1;
let loadingProgress = 0;
let fullscreen = false;
let viewport = document.getElementById("viewer3d");
let loadBtn = document.getElementById("loadBtn");
let viewerImg = document.getElementById("viewerImg");
let fullscreenBtn = document.getElementById("fullscreenBtn");
let loadingSpinner = document.getElementById("loadingSpinner");
let loadingBar = document.getElementById("loadingBar");

Image.prototype.completedPercentage = 0;

let imgs = [];
let imgLoaded = [];
let imageURLs = [
	"19RedBot1.jpg",
	"19RedBot2.jpg",
	"19RedBot3.jpg",
	"19RedBot4.jpg",
	"19RedBot5.jpg"
];

Image.prototype.load = async function(url){
	let thisImg = this;
	let xmlHTTP = new XMLHttpRequest();
	xmlHTTP.open('GET', url, true);
	xmlHTTP.responseType = 'arraybuffer';
	xmlHTTP.onloadstart = function() {
		thisImg.completedPercentage = 0;
	};
	xmlHTTP.onprogress = function(e) {
		thisImg.completedPercentage = parseInt((e.loaded / e.total) * 100);
	};
	xmlHTTP.onload = function(e) {
		let blob = new Blob([this.response]);
		thisImg.src = window.URL.createObjectURL(blob);
	};
	xmlHTTP.send();
};

loadBtn.addEventListener("click", function() {loaded = true;});
fullscreenBtn.addEventListener("click", fullscreenToggle)
document.body.onload = imageURLs.forEach(prepareDisplayImgs);

function clickManager(number) {
	if(number == 'next' && lastClicked < imageURLs.length - 1) {
		clicked = lastClicked + 1;
	}
	else if(number == 'previous' && lastClicked > -1) {
		clicked = lastClicked - 1;
	}
	if(number != 'next' && number != 'previous') {
		clicked = number - 1;
	}
	CanvasManager(clicked);
	loadingManager(clicked);
	lastClicked = clicked;
}

function CanvasManager(clicked) {
	if(clicked === -1) {
		if(loaded) {
			fadeIn(document.getElementById("modelViewer"));
		}
		else {
			fadeIn(loadBtn);
		}
	}
	else {
		if(loaded) {
			fadeOut(document.getElementById("modelViewer"));
		}
		fadeOut(loadBtn);
	}
}

function loadingManager(clicked) {
	for(let i = 0; i < imgs.length; i++)	{
		let img = imgs[i];
		if(i === clicked) {
			fadeIn(img);
		}
		else {
			fadeOut(img);
		}
	}

	if(!imgLoaded[clicked] && clicked >= 0){
		loadAndAddImage(viewerImg, clicked);
		imgLoaded[clicked] = true;
	}
}

function prepareDisplayImgs(item, index) {
	imgs[index] = new Image ();
	imgLoaded[index] = false;
}

function loadAndAddImage(imgContainer, number) {
	let img = imgs[number];
	img.load(`images/${imageURLs[number]}`);
	
	let promiseToLoadImg = new Promise((resolve) => {
		let progress = 5;
		fadeIn(loadingBar);
		fadeIn(loadingSpinner);
		let checkProgress = setInterval(frame, 10);
		function frame() {
			progress = img.completedPercentage;
			if (progress >= 100) {
				clearInterval(checkProgress);
				fadeOut(loadingBar);
				fadeOut(loadingSpinner);
				resolve();
			} else {
				loadingBarUpdate(progress);
			}
		}
	});
	promiseToLoadImg.then(() => {
		fadeIn(img);
		imgContainer.appendChild(img);
	});	
}

function fullscreenToggle() {
	if (fullscreen) {
		fullscreenClose();
		fullscreen = false
	}
	else {
		fullscreenOpen();
		fullscreen = true;
	}
}

function fullscreenOpen() {
	let elem = document.documentElement;
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.mozRequestFullScreen) { /* Firefox */
		elem.mozRequestFullScreen();
	} else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
		elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) { /* IE/Edge */
		elem.msRequestFullscreen();
	}
	viewport.classList.add("fullscreenViewer3d");
	viewport.style.width = `${window.innerWidth}px`;
	viewport.style.minWidth = "100%";
	viewport.classList.remove("defautViewer3D");
	fullscreenBtn.style.position = "fixed";
}

function fullscreenClose() {

	function fullscreencloseHelper() {
		viewport.classList.add("defautViewer3D");
		viewport.style.width = "";
		viewport.style.minWidth = "";
		viewport.classList.remove("fullscreenViewer3d");
		fullscreenBtn.style.position = "absolute";
	}

	if (document.exitFullscreen) {
		fullscreencloseHelper();
		document.exitFullscreen();
	} else if (document.mozCancelFullScreen) {
		fullscreencloseHelper();
		document.mozCancelFullScreen();
	} else if (document.webkitExitFullscreen) {
		fullscreencloseHelper();
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) {
		fullscreencloseHelper();
		document.msExitFullscreen();
	}
	else {
		fullscreencloseHelper();
	}
}

function loadingBarUpdate(width) {
	loadingBar.style.width = `calc(${width}% - 32px - 10px`;
}

function fadeOut(obj){
	obj.style.opacity = 0;
	obj.classList.remove("fadeOut");
	if(obj.classList.contains("fadeIn")) {
		obj.classList.add("fadeOut");
		obj.classList.remove("fadeIn");
		setTimeout(() => {obj.style.display = "none";}, 300);
	}
	visable = false;
};

function fadeIn(obj){
	obj.style.display = "block";
	obj.style.opacity = 1;
	obj.classList.add("fadeIn");
	obj.classList.remove("fadeOut");
};
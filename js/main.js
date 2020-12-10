let webGLViewer = document.getElementById("webGLViewer");
let article = webGLViewer.firstElementChild;
//pageLoader.addEventListener("click", replaceCatch);

function showWebGL(n) {
    fadeIn(article);
}

function fadeOut(obj){
	obj.style.opacity = 0;
	obj.classList.remove("fadeOut");
	if(obj.classList.contains("fadeIn")) {
		obj.classList.add("fadeOut");
		obj.classList.remove("fadeIn");
	}
	setTimeout(() => {obj.style.display = "none";}, 300);
	visable = false;
};

function fadeIn(obj){
	obj.style.display = "block";
	obj.style.opacity = 1;
	obj.classList.add("fadeIn");
	obj.classList.remove("fadeOut");
};
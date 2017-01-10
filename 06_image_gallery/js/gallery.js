(function(global, XHR){
	'use strict';

	var xhr = new XHR;
	var result_view = document.querySelector('.ajax-result');

	xhr.open("GET", "./data/gallery.json");
	xhr.send();
	xhr.onreadystatechange = function() {
		if(this.status === 200 && this.readyState === 4) {
			console.log('통신 데이터 전송 성공! ^^'); 

			var data = JSON.parse(this.response);
			var template = '';
			var photos = data.results;
			for(var i=0; i<photos.length; i++){
				template += [
					'<li>',
						'<a href="javascript:;" class="photo-link">',
							'<img class="photo-img" src="'+photos[i].image+'" alt="'+photos[i].alt+'">',
						'</a>',
					'</li>'
				].join('');
			}

		} else {
			console.log('통신 데이터 전송 실패');
		}
		result_view.innerHTML = template;

		var photoLink = document.querySelectorAll('.photo-link');
		var photoImg = document.querySelectorAll('.photo-img');
		// 유사배열을 배열로 쓸 수 있게 하기 
		photoLink = Array.prototype.slice.apply(photoLink);
		var slideBtn = document.querySelector(".slide-btn");
		var slideBtnIcon = document.querySelector(".slide-btn .fa");
		// 슬라이드 버튼이 눌렸는지 확인하기 
		var chkBtn = false;
		// 슬라이드 멈춤 버튼 클릭 여부 
		var slideBtnOn = false;
		// 사진 확대 눌렀는지 확인하기 
		var photoClick = false;
		// 사진이 담겨있는 배열의 인덱스 
		var index = 0;
		// 브라우저 height
		var windowHeight = window.innerHeight;
		// 검정배경 Div요소 만들기 
		var photoGallery = document.querySelector('.photo-gallery').firstElementChild;
		var menuCoverDiv = document.createElement('div');
		menuCoverDiv.setAttribute('class', 'menu-cover');
		// menuCoverDiv.style.height = photoGallery.parentNode.offsetHeight;
		// photoGallery.parentNode.insertBefore(menuCoverDiv, photoGallery);
		// 검정 배경 나오게 하기 
		function menuCover(el) {
			// 목표노드.부모노드.insertBefore(insert삽입할노드, target목표노드)
			photoGallery.parentNode.insertBefore(menuCoverDiv, photoGallery);
			// 확대된 사진의 height
			var photoHeight = el.offsetHeight;
			// 사진크기와 브라우저크기를 비교하여 검정 배경 height 정하기
			if((windowHeight-90) > photoHeight){
				menuCoverDiv.style.height = (windowHeight-10)+'px';
			}else{
				menuCoverDiv.style.height = (photoHeight+30)+'px';
			}
		}
		// 검정 배경 없애기 
		function removeMenuCover() {
			photoGallery.parentNode.removeChild(menuCoverDiv);
		}
		// 각 사진 클릭시 photoShow 함수 실행 
		function photoAddEvent() {
			for(var i=0; i<photoLink.length; i++){
				photoLink[i].addEventListener("click", photoShow, false);
			}
		}
		photoAddEvent();
		// photoAddEvent함수 removeEvent
		function photoRemoveEvent() {
			for(var i=0; i<photoLink.length; i++){
				photoLink[i].removeEventListener("click", photoShow, false);
			}
		}
		// 사진 클릭시 커지는 함수 
		function photoShow() {
			console.log("photoShow함수실행");
			// 현재 사진 
			index = photoLink.indexOf(this);
			// 현재 사진 제외하고 안보이게 처리 
			for(var j=0; j<photoLink.length; j++){
				if( j !== index ) {
					photoLink[j].classList.toggle("off");
				}
			}
			// 현재 사진 확대 
			this.classList.toggle("on");
			if(!photoClick){
				menuCover(this);
				// if(this.offsetHeight > windowHeight){
				// 	this.firstElementChild.style.width = '65%';
				// }
				photoClick = !photoClick;
				console.log('사진 클릭');
			}else{
				removeMenuCover();
				photoClick = !photoClick;
				index = 0;
				console.log('사진 클릭해제');
			}
			
		}
		// 슬라이드 쇼를 멈추고 사진들이 원래대로 돌아오게 하는 함수 
		function stopSlideShow(e){
			console.log("stopSlideShow함수실행");
			// 슬라이드 버튼이 눌러졌다면 
			if(chkBtn){
				photoLink[index].classList.remove("on");
			}else{
				photoLink[index-1].classList.remove("on");
			}
			clearInterval(slideInterval);
			photoAddEvent();
			removeMenuCover();
			slideBtn.classList.remove("pause-interval");
			slideBtn.classList.remove("on");
			for(var j=0; j<photoLink.length; j++){
				photoLink[j].classList.remove("off");
			}
			index = 0;
			chkBtn = false;
			slideBtnOn = false;
			photoClick = false;
			removeStopSlideShow();
		}
		// stopSlideShow함수 removeEvent
		function removeStopSlideShow(){
			for(var j=0; j<photoLink.length; j++){
				photoLink[j].removeEventListener("click", stopSlideShow, false);
			}
		}
		// 슬라이드 쇼 함수
		function slideShow() {
			for(var j=0; j<photoLink.length; j++){
				// 슬라이드 쇼 함수 진행 중 확대된 사진을 클릭하면 슬라이드 쇼 멈추기 
				photoLink[j].addEventListener("click", stopSlideShow, false);
				if( j !== index ) {
					photoLink[j].classList.add("off");
				}
			}
			photoLink[index].classList.add("on");
			menuCover(photoLink[index]);
			// photoClick = !photoClick;
			global.slideInterval = setInterval(function(){
				index++;
				if(index < photoLink.length){
					photoLink[index-1].classList.remove("on");
					photoLink[index-1].classList.add("off");
					photoLink[index].classList.remove("off");
					photoLink[index].classList.add("on");
					menuCover(photoLink[index]);
					console.log(index);
				}else { // 슬라이드 쇼 끝난 후 
					chkBtn = false;
					slideBtnOn = false;
					photoClick = false;
					stopSlideShow();
				}
			}, 2000);
		}
		// 슬라이드 버튼 클릭시 
		slideBtn.onclick = function(){
			// 슬라이드 플레이 
			if(!chkBtn && !slideBtnOn){
				slideShow();
				photoRemoveEvent();
				slideBtn.classList.remove("pause-interval");
				slideBtn.classList.add("on");
				chkBtn = true;
				slideBtnOn = true;
			}else{ // 슬라이드 멈춤 
				clearInterval(global.slideInterval);
				slideBtn.classList.remove("on");
				slideBtn.classList.add("pause-interval");
				chkBtn = true;
				slideBtnOn = false;
				// photoClick = false;
			}
			
		}
		
	}

})(this, this.XMLHttpRequest || this.ActiveXObject('Microsoft.XMLHTTP'));
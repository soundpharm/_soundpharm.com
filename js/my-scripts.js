// COMMON SCRIPTS FOR SOUNDPHARM.COM ///////////////////
var navType = 'standard';
var urlParams = '';

function getHash () {
	return window.location.hash.substring(1);
}

function getParams () {
	var match,
		pl     = /\+/g,  // Regex for replacing addition symbol with a space
		search = /([^&=]+)=?([^&]*)/g,
		decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
		query  = window.location.search.substring(1);

	urlParams = {};
	while (match == search.exec(query)) {
	   urlParams[decode(match[1])] = decode(match[2]);
	}
}
// reset params if popstate changes
(window.onpopstate = function () {
	getParams();
});

// jQuery scripts ////////////////////////////////////
(function($) {
	var docBody 	= $('body'),
		articles 	= $('.articles'),
		container 	= $('#container'),
		nav 		= $('#nav');
	
// Get Page Name ////////////////////////////////////
	function getPageName() {
		var pathName = window.location.pathname,
			pagePath = '';
		if (pathName.indexOf('/') != -1) {
			pagePath = pathName.split('/').pop();
		} else {
			pagePath = pathName;
		}	
		return pagePath;
	}

// parallax scrolling ////////////////////////////////////
	var parallaxHTML = '<div class="parallax"><div id="bg2px" data-type="background" data-speed="0.9"></div><div id="bg3px" data-type="background" data-speed="0.6"></div><div id="bg6px" data-type="background" data-speed="0.3"></div></div>';
	parallaxInit = function() {
		// need to reset parallax, wait for full page load then init
		//var tlPlax = new TimelineLite();
		var windo = $(window);
			var plax = $('.parallax');
			docBody.attr('style', '');
			var bHeight = docBody.height();
			if (bHeight < windo.height()) {
				// make body fit window height
				bHeight = windo.height();
				docBody.height(bHeight);
			}
			TweenLite.to(plax, 0.75, {height:bHeight, ease:Power4.easeInEaseOut});
			TweenLite.to(plax, 0.75, {opacity:1, ease:Power4.easeIn});
			$('div[data-type="background"]').each(function(){
				var bgobj = $(this); // assigning the object
				//var bWidth = $('body').css('width');
				var bgSpeed = bgobj.data('speed');
				TweenLite.to(bgobj, 0.75, {height:bHeight, ease:Power4.easeInEaseOut});
				windo.scroll(function() {
					var yPos = (windo.scrollTop() * bgSpeed);
					// Put together our final background position
					var yTop = yPos + 'px';
					// Move the background
					bgobj.css({ top: yTop });
				});
			});
		//} else {
		if (windo.width() > 479) {
			$('body').addClass('bgSmallScreen');
		}
	};
	docBody.prepend(parallaxHTML); // do once on first load

// Gallery XML  ////////////////////////////////////////////
	imgGallery = function(pgCount) {
		if ($('.gallery').length) {
			$('.gallery').each(function(index, el) {
				var gallery = $(this),
					galleryID = gallery.attr('id'),
					category = gallery.attr('data-medium').split(","),
					images = '',
					pageThis = false;

				// set up pagination
				if ($('.gallery.pageThis').length) {
					pageThis = true;
					var page,
						pageSize = (pgCount) ? pgCount : 9,
						initImg = 0,
						imgCount = 0,
						pages = 0,
						pagination = $('<div />').addClass('pagination cf gradient'),
						pageList = $('<ul />').addClass('pageList cf'),
						thisLocation = window.location;

					if (urlParams.page === null || urlParams.page === '' || typeof urlParams.page == 'undefined') {
						page = 1;
					} else {
						page = urlParams.page;
						initImg = page*pageSize;
					}
				}

				//categories = categories.split(",")

				$.ajax({
					url: '/look/all-new-images.json',
					type: 'GET',
					dataType: 'json',
					contentType: 'application/json; charset=utf-8',
					data: '{}',
					success: function (result, textStatus, jqXHR) {
						images = result.images;
						//imgArray = new Array(images);
						//imgArray.year.sort(function(a, b){return a-b;});
						// thumbnails
						var matchCount = 0;
						$.each(images, function(i, el) {
							//if (i >= initImg && i < initImg+pageSize) { // use for pagination
							if (images[i].category == category) { // use for category filtering
								var imgURL = images[i].image,
									imgCaption = images[i].caption,
									imgThumb = images[i].thumbnail,
									imgMedium = images[i].medium,
									imgSize = images[i].size,
									imgCategory = images[i].category,
									imgNotes = images[i].notes,
									imgYear = images[i].year,
									imgDate = images[i].date,
									imgPixels = images[i].pixels,
									imgPrice = images[i].price,
									imgLi = '';

								 if (imgSize !== '' && imgDate !== '') {
								 	imgSize = imgSize+',';
								 }

								imgLi = '<figure class="galleryItem cf" data-index="'+matchCount+'" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject"><a href="'+imgURL+'" class="galleryLink" itemprop="contentUrl" data-size="'+imgPixels+'" data-index="'+matchCount+'"><img src="'+imgThumb+'" itemprop="thumbnail" class="galleryImg" alt="'+imgCaption+'">'+imgCaption+'</a><figcaption class="galleryItemInfo cf"><h3>'+imgCaption+'</h3><strong>Details:</strong> '+imgMedium+', '+imgSize+' '+imgDate+' <strong class="price">Price:</strong>&nbsp;'+imgPrice+'<br>'+imgNotes+'</figcaption></figure>';
								gallery.append(imgLi);
								matchCount++;
							}
						}); 
						// pagination
						if (pageThis) {
							imgCount = images.length;
							pages = Math.ceil(imgCount / pageSize);
							pagination.html('Page '+page+' of '+pages);
							for (i = 1; i <= pages; i++) {
								if (page === i) {
									pageItem = '<li class="pageItem current">'+i+'</li>';
								} else {
									pageItem = '<li class="pageItem"><a href="'+thisLocation+'?page='+i+'" class="pageLink">'+i+'</a></li>';
								}
								pageList.append(pageItem);
							}
							pagination.append(pageList);
							gallery.before(pagination);
						}

					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.log(jqXHR.response+' '+errorThrown);
					}
				})
				.done(function() {
					//console.log("Gallery success");
					initPhotoSwipe(gallery);
				})
				.fail(function() {
					console.log("JSON Gallery error");
				})
				.always(function() {
				});
				
			});
		} else {
			if ($('.galleryLink').length) {
				var container = $('#content');
				initPhotoSwipe(container);
			}
			parallaxInit();
		}
	};

// PhotoSwipe Lightbox /////////////////////////////////////
	initPhotoSwipe = function (gallery) {
		// 
		var $pswp = $('.pswp')[0],
			galCount = gallery.length - 1,
			image = [];

		gallery.each( function(i) {
			var $pic     = $(this),
				getItems = function() {
					var items = [];
					$pic.find('.galleryLink').each(function() {
						var $href   = $(this).attr('href'),
							$size   = $(this).data('size').split('x'),
							$width  = $size[0],
							$height = $size[1],
							$srcI	= $href.lastIndexOf("/"),
							$src1	= $href.substr(0,$srcI),
							$src2 	= $href.substr($srcI),
							$thumb 	= $src1+'/thumbs'+$src2,
							$title 	= ' ';

							if ($(this).hasClass('imgLink')) {
								$title = $(this).html();
							} else {
								$title = $(this).next('.galleryItemInfo').html();
							}

						var item = {
							src 	: $href,
							w   	: $width,
							h   	: $height,
							msrc 	: $thumb,
							title 	: $title
						};

						items.push(item);
					});
					return items;
				};

			var items = getItems();

			$.each(items, function(index, value) {
				image[index]     = new Image();
				image[index].src = value.src;
			});

			$pic.on('click', '.galleryLink', function(event) {
				event.preventDefault();
				
				var $index = $(this).index();
				var options = {
					index: $index,
					bgOpacity: 0.8,
					showHideOpacity: true,
					closeOnScroll: false,
					history: false,
					shareButtons: [
						{id:'facebook', label:'Share on Facebook', url:'https://www.facebook.com/sharer/sharer.php?u={{url}}'},
						{id:'twitter', label:'Tweet', url:'https://twitter.com/intent/tweet?text={{text}}&url={{url}}'},
						{id:'pinterest', label:'Pin it', url:'http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}'},
						{id:'download', label:'Download image', url:'{{raw_image_url}}', download:false}
					]
				};

				var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
				lightBox.init();
			});

			if (i == galCount) {
				parallaxInit();
			}
		});
	};

	badPhotoSwipe = function(gallery) {

		// build items array
		var items = [];
		gallery.find('.galleryLink').each(function(index, el) {
			var _this = $(this),
				targetImg = _this.attr('href'),
				pixels = _this.attr('data-size'),
				pixelArray = pixels.split('x'),
				pixelsW = parseInt(pixelArray[0], 10),
				pixelsH = parseInt(pixelArray[1], 10),
				imgTitle = _this.find('.galleryImg').attr('title'),
				imgCaption = _this.find('.galleryItemInfo').html(),
				psItem = {src: targetImg, w: pixelsW, h: pixelsH, title: imgTitle};
			//console.log(psItem);
			items.pop(psItem);
		});

		var $pswp = $('.pswp')[0];

		gallery.on('click', 'figure', function(event) {
			event.preventDefault();
			 
			var $index = $(this).index(),
				options = {
					index: $index,
					bgOpacity: 0.7,
					showHideOpacity: true
				};
			 
			// Initialize PhotoSwipe
			var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
			lightBox.init();
		});
	};

// Content Refresh ////////////////////////////////////////////
	updateContent = function(isHome){
		//var pagePath = getPageName();
		var pagePath = window.location.pathname + ' #content';
		//alert(pagePath);
		$('.content').load(pagePath, function(response, status, xhr) {
			if (status == 'error') {
				var msg = 'Sorry but there was an error: ';
				console.log(msg + xhr.status + " " + xhr.statusText);
			} else {
				// success, carry on
				if ($('.home').length || isHome === true){
					// do nothing on Home
				} else {
					TweenLite.to('.content', 0.75, {opacity:1, onComplete: function() {imgGallery();}});
				}
			}
			doPop = true;
		});
	};	

// Transition Animations ----------------------------------------
	/* jshint ignore:start */
	goSubPage = function(clicked) {
		var sectionNav = clicked.parents('.navLI');
		if (!sectionNav.hasClass('active')) {
			//console.log('other section');
			$('.navLI').removeClass('active');
			sectionNav.addClass('active');
		}
		$('.subNavLI').removeClass('active');
		clicked.addClass('active');
		TweenLite.to('.content', 0.75, {opacity:0, onComplete: function() {updateContent();}});
	};
	goHome = function() {
		var tlToHome = new TimelineLite();
		var winHeight = $(window).height();
		$('#nav').attr('style','');
		tlToHome.to(container, 0.5, {height:winHeight, ease:Power4.easeIn}), '-=0.5';
		tlToHome.to('.content', 0.5, {opacity:0, onComplete: function() {$('.content').slideUp();}});			
		tlToHome.to(nav, 0.5, {opacity:0, height:'600px', onComplete: function() {
			$('.navA, .subNavUL').attr('style','');
			$('.navLI, .subNavLI').attr('style','').removeClass('active');
		}}), '-=0.5';
		tlToHome.to('.title', 1, {width:'100%', ease:Power4.easeInOut, onComplete: function() {docBody.addClass('home');}}), '-=0.5';
		tlToHome.to(nav, 0.5, {opacity:1, onComplete: function() {nav.attr('style','');parallaxInit();}});
	};
	goTopPage = function(navLI) {
		var winWidth = $(window).width();
		if (winWidth > 769) {
			$('.active .subNavUL').fadeOut(400, function() {
				$('.subNavLI').removeClass('active');
				$('.navLI.active .navA').attr('style','');
				$('.navLI').removeClass('active').attr('style','');

				function activeContent () {
					navLI.find('.subNavLI:first').addClass('active');
					navLI.find('.subNavUL').fadeIn(400);
					navLI.addClass('active');
					updateContent();
				}
				TweenLite.to('.content', 0.75, {opacity:0, onComplete: function() {activeContent();}});
			});
		} else {
			var tlMobiSub = new TimelineLite();
			tlMobiSub.to('.active .subNavUL', 0.4, {opacity:0.5, onComplete: function() {
				$('.subNavLI').removeClass('active');
				$('.navLI.active .navA').attr('style','');
				$('.navLI').removeClass('active').attr('style','');
			}});
			tlMobiSub.to('.content', 0.75, {opacity:0, onComplete: function() {
				navLI.find('.subNavLI:first').addClass('active');
			}});
			tlMobiSub.to(navLI.find('.subNavUL'), 0.4, {opacity:1, onComplete: function() {
				navLI.addClass('active');
				updateContent();
			}});
		}
	};
	leaveHome = function(clicked, navLI) {
		//animation functions
		function activateSub () {
			var notNavLI = $('.navLI').not(navLI),
				tlToSub = new TimelineLite(),
				toNews = navLI.hasClass('nav3'),
				hasNews = $('.articles').length,
				conHeight = $(window).height() - 113,
				winWidth = $(window).width(),
				ttlWidth = "100%";
			if (winWidth > 640) {ttlWidth = "350px"};
			clicked.removeClass('clicked');
			tlToSub.to(notNavLI, 0, {scale:1, display:'block', onComplete: function() {navLI.addClass('active');}});
			tlToSub.to('.title', 0.75, {width:ttlWidth, ease:Power4.easeInOut,  onComplete: function() {
				$('.navA').attr('style','');
				$('.navLI').attr('style','opacity:0;');
			}}); 
			if (toNews === true && hasNews > 0) { // first time or returning to News
				tlToSub.to(articles, 0, {opacity:0, display:'block',  onComplete: function() {$('.content').slideDown(600);}});
				tlToSub.to('.content', 0.75, {opacity:1, onComplete: function() {docBody.removeClass('home');}});
				tlToSub.to(articles, 0.75, {opacity:1, onComplete: function() {imgGallery();}}), '-=0.75';
			} else { // to non-News or 
				tlToSub.call(function() {updateContent(true);});
				tlToSub.to('.content', 0, {opacity:0, height:conHeight, onComplete: function() {$('.content').show(); docBody.removeClass('home');}});
			}
			tlToSub.to(nav, 0.25, {opacity:1});
			tlToSub.to('.navLI', 0.25, {opacity:1});
			tlToSub.to(notNavLI, 0.25, {opacity:1, onComplete: function() {$('.active .subNavLI').first().addClass('active'); $('.active .subNavUL').slideDown(); $('.content').css('height','auto');}});
			if (toNews === false || hasNews === 0) {
				tlToSub.to('.content', 0.75, {opacity:1, onComplete: function() {imgGallery();}});
			}
		}
		// hide other nav items
		var notClicked = $('.home .navLI').not(navLI),
			tlHome = new TimelineMax(),
			navBox = $('#nav'),
			navLeft = navBox.width() / 6,
			navTop = navBox.height() / 7,
			navLIrad = navLI.width();
		TweenLite.to(navLI, 0.25, {zIndex:11});
		tlHome.to('.navLI', 1, {scale:0.75, top:navTop, left:navLeft, ease:Power4.easeInOut});
		tlHome.to(notClicked, 0.5, {opacity:0, ease:Power4.easeInOut}, '-=0.5');
		tlHome.to(clicked, 0.5, {width:navLIrad, height:navLIrad, textShadow:'0px 0px 10px #333, 0px 0px 1px #fff', top:0, left:0, lineHeight:navLIrad, textIndent:0, ease:Power4.easeInOut}, '-=0.5'), '+=0.25';
		tlHome.to(clicked, 0.75, {textShadow:'0px 0px 80px #000, 0px 0px 1px #fff'});
		tlHome.to(clicked, 0.5, {className:'+=clicked', opacity:0, ease:Power4.easeIn}, '-=0.5');
		tlHome.to(navLI, 1, {scale:2, opacity:0, ease:Power4.easeIn}, '-=0.5');
		tlHome.to(navLI, 0, {scale:1, onComplete:activateSub});
		tlHome.to(nav, 0, {opacity:0});
	};
	/* jshint ignore:end */
	
// Navigation ---------------------------------------------------
	navInit = function() {
		// TOP Navigation
		$('.navA').click(function(event){
			var clicked = $(this),
				navLI = clicked.parent('.navLI'),
				pagePath = event.target.href,
				pageName = clicked.html();
			if ($('.home').length){
				if (navType === 'html5') {
					event.preventDefault();
					window.history.pushState(pageName, pageName, pagePath);
				}
				// HOME PAGE MAIN NAV /////////////////////////////
				if (navLI.hasClass('active')){
					return false;
					// stop, not sure how a home page link could have 'active' class
				} else {
					leaveHome(clicked, navLI);
				}
			} else { // TOP LEVEL NAV - NOT ON HOME PAGE /////////////////////////////
				if (navLI.hasClass('active')){
					return false;
					// stop - this link/section is already active
				} else { 
					if (navType === 'html5') {
						event.preventDefault();
						window.history.pushState(pageName, pageName, pagePath);
					}
					goTopPage(navLI);
				}
			}
		});
		
		// SUB Navigation
		$('.subNavLI').click(function(event){
			var clicked = $(this);
			if (clicked.hasClass('active')) {
				return false; // it's already active, stop
			} else {
				if (navType === 'html5') {
					var pagePath = event.target.href;
					var pageName = clicked.find('a').html();
					event.preventDefault();
					window.history.pushState(pageName, pageName, pagePath);
				}
				goSubPage(clicked);
			}
		});

		// HOME Link
		$('.title a').click(function(event){
			if ($('.home').length){
				// don't do it!
			} else {
				if (navType === 'html5') {
					event.preventDefault();
					window.history.pushState("home", "soundpharm home", event.target.href);
				}
				goHome();
			}
		});

		// FOOTER links
		$('.footer').click(function(event){
			var clicked = $(this);
			target = clicked.attr('href');
			if (clicked.hasClass('homeA')) {
				event.preventDefault();
				$('.title a').trigger('click');
			} else if (clicked.hasClass('foot1')) {
				event.preventDefault();
				$('.nav1 .navA').trigger('click');
			} else if (clicked.hasClass('foot2')) {
				event.preventDefault();
				$('.nav2 .navA').trigger('click');
			} else if (clicked.hasClass('foot3')) {
				event.preventDefault();
				$('.nav3 .navA').trigger('click');
			}
			window.scrollTo(0,0);
		});

	};

// Initialize jqFunctions ////////////////////////////////////////
	// INIT SUB PAGE ON DIRECT PAGE HIT 
	function setSubNav (targetPage) {
		$('#nav').find('a[href="' + targetPage + '"]:last').parents('li').addClass('active');
		$('.active .subNavUL').fadeIn(600);	
	}
	function testSubNav () {
		if ($('.home').length) {
			// Handle direct hit on News page "/index.php#articles"
			var pageHash = getHash();
			if (pageHash === 'articles') {
				docBody.removeClass('home');
				var thisPath = window.location.pathname + '#' + pageHash;
				setSubNav(thisPath);
			}
		} else {
			var pgArray = ['.pg-look','.pg-watch','.pg-photo','.pg-about','.pg-songs','.pg-bio','.pg-resume','.pg-statement'];
			$.each(pgArray, function(i, val) {
				if ($(pgArray[i]).length) {
					var thisPath = window.location.pathname;
					//alert(pgArray[i] + ' ' + thisPath);
					setSubNav(thisPath);
				}
			});
		}
	}
	imgGallery();
	if (Modernizr.history) {
		$('#content').wrap('<div class="content">');
		// Hooray for HTML5!
		navType = 'html5';

		testSubNav();
		// Nav & Parallax
		navInit();
		//parallaxInit();

		// Trigger page change on browser event
		var _popStateEventCount = 0;
		window.onpopstate = function(event) {
			//console.log(event.state.data);
			_popStateEventCount++;
			if (_popStateEventCount == 1) {
				return;
			}
			// just to http because all the animation variables are insane
			location.reload();
		};

		// Set initial history state
		history.replaceState(document.title, document.title, document.location.href); 
	} else {
		parallaxInit();
	}
	// END jQuery functions
})(jQuery);

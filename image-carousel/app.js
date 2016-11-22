var pageTitle = document.getElementById('page-heading');
var carousel = document.getElementById('carousel');

var carouselSlider = {
  imagesPath: "images/",
  imageWidth: 1200,
  duration: 5000,
  count: 0,
  currentImage: 1,
  timers: [],
  init: function(imagePaths) {
    // add provided images
    for(var image in imagePaths) {
      carouselSlider.addSlide(imagePaths[image]);
    };
    // bind buttons
    var stopButton = document.getElementById('stop-carousel');
    stopButton.addEventListener('click', function() {
      if(stopButton.classList.contains('stopped')) {
        stopButton.className = '';
        carouselSlider.run();
      } else {
        carouselSlider.stop();
      }
    });
    var previous = document.getElementById('previous');
    previous.addEventListener('click', function(e) {
      e.preventDefault();
      carouselSlider.stop();
      let target;
      if(carouselSlider.currentImage === 1) {
        target = carouselSlider.count;
      } else {
        target = carouselSlider.currentImage - 1;
      }
      carouselSlider.slideTo(target)
      carouselSlider.run(carouselSlider.currentImage);
    });
    var next = document.getElementById('next');
    next.addEventListener('click', function(e) {
      e.preventDefault();
      carouselSlider.stop();
      let target;
      if(carouselSlider.currentImage === carouselSlider.count) {
        target = 1;
      } else {
        target = carouselSlider.currentImage + 1;
      }
      carouselSlider.slideTo(target);
      carouselSlider.run(carouselSlider.currentImage);
    });
    carouselSlider.run();
  },
  addSlide: function(fileName) {
    var newSlide = document.createElement("li");
    newSlide.className = 'slide';
    carousel.appendChild(newSlide);
    newSlide.appendChild(document.createElement("img"))
      .src=(this.imagesPath + fileName);
    this.count += 1;
    this.addDot(this.count);
  },
  slideTo: function(slideNumber) {
    this.currentImage = slideNumber;
    let xValue = ((slideNumber-1) * this.imageWidth);
    carousel.style.transform = 'translateX(-' + xValue + 'px)';
  },
  run: function(i=null) {
    if(!i || i > carouselSlider.count) {
      var i = 1;
    }
    this.timers.push(setTimeout(function() {
      carouselSlider.slideTo(i);
      i += 1;
      carouselSlider.run(i);
    }, carouselSlider.duration));
  },
  stop: function() {
    var stopButton = document.getElementById('stop-carousel');
    stopButton.classList.add('stopped');
    for (var i = 0; i < this.timers.length; i++) {
      clearTimeout(this.timers[i]);
    };
    this.timers = [];
  },
  addDot: function(imageNumber) {
    let dots = document.getElementById('dots');
    let dot = document.createElement('li');
    dot.className = 'dot';
    dot.setAttribute('id', 'slide' + (this.count));
    dots.appendChild(dot);
    dot.addEventListener('click', function() {
      carouselSlider.slideTo(imageNumber);
    });
  }
}

// crank 'er up
carouselSlider.init(['ocean.jpg','west-park.jpg','clouds-rivers.jpg','desert-road.jpg']);

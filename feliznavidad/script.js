/*var bgMusicURL = './FELIZ NAVIDAD.mp3';
var bgMusicControls = true; 

// Play background music if bgMusicURL is provided
if (bgMusicURL) {
  document.getElementById('music-container').innerHTML += `
    <audio src="${bgMusicURL}" ${bgMusicControls ? 'controls' : ''} autoplay loop>    
      <p>If you are reading this, it is because your browser does not support the audio element.</p>
    </audio>
  `;
}*/
// Configuración de la música
var bgMusicURL = './FELIZ NAVIDAD.mp3';
var bgMusicControls = true; 

// Reproducir la música de fondo
function initAudio() {
  if (bgMusicURL) {
    const musicContainer = document.getElementById('music-container');
    if (musicContainer) {
      musicContainer.innerHTML = `
        <audio src="${bgMusicURL}" ${bgMusicControls ? 'controls' : ''} autoplay loop>    
          <p>If you are reading this, it is because your browser does not support the audio element.</p>
        </audio>
      `;
    }
  }
}

// Asegurarse de que el DOM está cargado antes de iniciar
/*document.addEventListener('DOMContentLoaded', function() {
  
});*/

MorphSVGPlugin.convertToPath('polygon');
var xmlns = "http://www.w3.org/2000/svg",
  xlinkns = "http://www.w3.org/1999/xlink",
select = function(s) {
    return document.querySelector(s);
  },
  selectAll = function(s) {
    return document.querySelectorAll(s);
  },
  pContainer = select('.pContainer'),
  mainSVG = select('.mainSVG'),
  star = select('#star'),
  sparkle = select('.sparkle'),
  tree = select('#tree'),
  showParticle = true,
  particleColorArray = ['#E8F6F8', '#ACE8F8', '#F6FBFE','#A2CBDC','#B74551', '#5DBA72', '#910B28', '#910B28', '#446D39'],
  particleTypeArray = ['#star','#circ','#cross','#heart'],
 // particleTypeArray = ['#star'],
  particlePool = [],
  particleCount = 0,
  numParticles = 201


gsap.set('svg', {
  visibility: 'visible'
})

gsap.set(sparkle, {
	transformOrigin:'50% 50%',
	y:-100
})

let getSVGPoints = (path) => {
	
	let arr = []
	var rawPath = MotionPathPlugin.getRawPath(path)[0];
	rawPath.forEach((el, value) => {
		let obj = {}
		obj.x = rawPath[value * 2]
		obj.y = rawPath[(value * 2) + 1]
		if(value % 2) {
			arr.push(obj)
		}
		//console.log(value)
	})
	
	return arr;
}
let treePath = getSVGPoints('.treePath'),
    treeBottomPath = getSVGPoints('.treeBottomPath'),
    mainTl = gsap.timeline({delay:0, repeat:0}),
    starTl;

function flicker(p){

  gsap.killTweensOf(p, {opacity:true});
  gsap.fromTo(p, {
    opacity:1
  }, {
		duration: 0.07,
    opacity:Math.random(),
    repeat:-1
  })
}

function createParticles() {
  
  var i = numParticles, p, particleTl, step = numParticles/treePath.length, pos;
  while (--i > -1) {
    
    p = select(particleTypeArray[i%particleTypeArray.length]).cloneNode(true);
    mainSVG.appendChild(p);
    p.setAttribute('fill', particleColorArray[i % particleColorArray.length]);
    p.setAttribute('class', "particle");   
    particlePool.push(p);
    //hide them initially
    gsap.set(p, {
                 x:-100, 
                 y:-100,
   transformOrigin:'50% 50%'
                 })
    
    

  }

}

var getScale = gsap.utils.random(0.5, 3, 0.001, true);

function playParticle(p){
  if(!showParticle){return};
  var p = particlePool[particleCount]
 gsap.set(p, {
	 x: gsap.getProperty('.pContainer', 'x'),
	 y: gsap.getProperty('.pContainer', 'y'),
	 scale:getScale()
    }
    );
var tl = gsap.timeline();
  tl.to(p, {
		duration: gsap.utils.random(0.61,6),
      physics2D: {
        velocity: gsap.utils.random(-23, 23),
        angle:gsap.utils.random(-180, 180),
        gravity:gsap.utils.random(-6, 50)
      },
      scale:0,
      rotation:gsap.utils.random(-123,360),
      ease: 'power1',
      onStart:flicker,
      onStartParams:[p],
      onRepeat: (p) => {
        gsap.set(p, {         
            scale:getScale()
        })
      },
      onRepeatParams: [p]

    });
  

  particleCount++;
  particleCount = (particleCount >=numParticles) ? 0 : particleCount
  
}

function drawStar(){
  
  starTl = gsap.timeline({onUpdate:playParticle})
  starTl.to('.pContainer, .sparkle', {
		duration: 6,
		motionPath :{
			path: '.treePath',
      autoRotate: false
		},
    ease: 'linear'
  })  
  .to('.pContainer, .sparkle', {
		duration: 1,
    onStart:function(){showParticle = false},
    x:treeBottomPath[0].x,
    y:treeBottomPath[0].y
  })
  .to('.pContainer, .sparkle',  {
		duration: 2,
    onStart:function(){showParticle = true},
		motionPath :{
			path: '.treeBottomPath',
      autoRotate: false
		},
    ease: 'linear'    
  },'-=0')
.from('.treeBottomMask', {
		duration: 2,
  drawSVG:'0% 0%',
  stroke:'#FFF',
  ease:'linear'
},'-=2')  
   
}


createParticles();
drawStar();
initAudio();

mainTl.from(['.treePathMask','.treePotMask'],{
	duration: 6,
  drawSVG:'0% 0%',
  stroke:'#FFF',
	stagger: {
		each: 6
	},
  duration: gsap.utils.wrap([6, 1,2]),
  ease:'linear'
})
.from('.treeStar', {
	duration: 3,
  scaleY:0,
  scaleX:0.15,
  transformOrigin:'50% 50%',
  ease: 'elastic(1,0.5)'
},'-=4')

 .to('.sparkle', {
	duration: 3,
    opacity:0,
    ease:"rough({strength: 2, points: 100, template: linear, taper: both, randomize: true, clamp: false})"
  },'-=0')
  .to('.treeStarOutline', {
	duration: 1,
    opacity:1,
    ease:"rough({strength: 2, points: 16, template: linear, taper: none, randomize: true, clamp: false})"
  },'+=1')

// Función para crear luces en el árbol
function createTreeLights() {
  const numLights = 30;
  const colors = ['#ff0000', '#00ff00', '#ffff00', '#ff00ff', '#00ffff'];
  
  const lightsContainer = document.createElementNS(xmlns, "g");
  lightsContainer.setAttribute("class", "lightsContainer");
  mainSVG.appendChild(lightsContainer);
  
  // Crear luces en forma de árbol - ajustado al viewBox del árbol
  for(let i = 0; i < numLights; i++) {
    const light = document.createElementNS(xmlns, "circle");
    light.setAttribute("r", "4");
    light.setAttribute("fill", colors[i % colors.length]);
    light.setAttribute("class", "treeLight");
    
    // Distribuir las luces en forma triangular
    const progress = i / numLights;
    const centerX = 400; // Centro del viewBox
    const width = 150 - (progress * 120); // Se estrecha hacia arriba
    const x = centerX + gsap.utils.random(-width/2, width/2);
    const y = 200 + (progress * 250); // Ajustado a la altura del árbol
    
    light.setAttribute("cx", x);
    light.setAttribute("cy", y);
    
    lightsContainer.appendChild(light);
  }
  
  return lightsContainer;
}

// Función para animar las luces
function animateLights(lights) {
  const lightElements = lights.querySelectorAll('.treeLight');
  
  gsap.to(lightElements, {
    duration: "random(0.3, 1)",
    opacity: "random(0.3, 1)",
    repeat: -1,
    yoyo: true,
    stagger: {
      each: 0.1,
      repeat: -1,
      yoyo: true
    }
  });
  
  // Añadir brillo alrededor de las luces
  gsap.to(lightElements, {
    duration: "random(0.5, 1.5)",
    scale: "random(1, 1.5)",
    repeat: -1,
    yoyo: true,
    stagger: {
      each: 0.2,
      repeat: -1,
      yoyo: true
    }
  });
}

// Función para añadir copos de nieve
function createSnowflakes() {
  const numSnowflakes = 70;
  const snowContainer = document.createElementNS(xmlns, "g");
  snowContainer.setAttribute("class", "snowContainer");
  mainSVG.appendChild(snowContainer);
  
  for(let i = 0; i < numSnowflakes; i++) {
    const snowflake = document.createElementNS(xmlns, "circle");
    snowflake.setAttribute("r", gsap.utils.random(1, 3));
    snowflake.setAttribute("fill", "#ffffff");
    snowflake.setAttribute("class", "snowflake");
    
    // Distribuir los copos por todo el ancho del viewBox
    const x = gsap.utils.random(0, 800); // Ancho total del viewBox
    const y = gsap.utils.random(-50, 100);
    snowflake.setAttribute("cx", x);
    snowflake.setAttribute("cy", y);
    
    snowContainer.appendChild(snowflake);
  }
  
  return snowContainer;
}

// Función para animar la nieve
function animateSnow(snow) {
  const snowflakes = snow.querySelectorAll('.snowflake');
  
  gsap.to(snowflakes, {
    duration: "random(4, 8)",
    y: "+=650", // Ajustado al alto del viewBox
    x: "random(-50, 50)", // Movimiento lateral aleatorio
    repeat: -1,
    delay: "random(0, 2)",
    ease: "none",
    stagger: {
      each: 0.1,
      repeat: -1
    },
    onRepeat: function(target) {
      gsap.set(target.targets()[0], {
        y: -50,
        x: gsap.utils.random(0, 800) // Reposicionar en la parte superior
      });
    }
  });
}

// Modificar la timeline principal
mainTl.add(starTl, 0)
  .call(() => {
    setTimeout(() => {
      const lights = createTreeLights();
      animateLights(lights);
      const snow = createSnowflakes();
      animateSnow(snow);
    }, 100); // Pequeño retraso para asegurar que el árbol esté dibujado
  }, null, "+=0.5") // Ajustar el timing después de la animación principal

gsap.globalTimeline.timeScale(1.5);
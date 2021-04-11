'use strict';

const btnsPanel = document.querySelector('#panel');
const colourBtn = document.querySelector('#colour-btn');
const shapeBtn = document.querySelector('#shape-btn');

const popup = document.querySelector('#popup');
const popupColourPicker = document.querySelector('#popup-colour-picker');
const picker = document.querySelector('#picker');

const popupThickness = document.querySelector('#popup-thickness');
const slider = document.querySelector('#slider');
const sliderPercentage = document.querySelector('#slider-percentage');
const sliderBtn = document.querySelector('#slider-btn');

const popupShapes = document.querySelector('#popup-shapes');
const shapes = document.querySelector('#shapes');

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let isDrawShape = false;
let colourChosen = '#000';
let shapeChosen;
const colourArr = ['red', ' blue', 'green', 'yellow', 'orange', 'pink', 'purple', ' brown', 'burlywood', 'cyan', 'teal', 'black' ];
const shapeArr = ['square', 'rectangle', 'triangle', 'circle', 'heart'];



/*FUNCTIONS*/
//mousedown event draw lines
const start = (event) => {
    isDrawing = true;

    //draw if mouse clicked (mouse down)
    draw(event);
}

//mousedown event draw shapes
const startShape = ({clientX: x, clientY: y}) => {
    isDrawing = true;

    drawingSettings();
    generateShape(x, y);
}

//mousemove event draw lines; destructuring the event object parsed in; only need clientX and clientY property and values; xPos and yPos of mouse
const draw = ({clientX: x, clientY: y}) => {
    if(!isDrawing) return;

    drawingSettings();

    ctx.lineCap = 'round';

    //begin path
    ctx.lineTo(x, y);

    //draw path
    ctx.stroke();

    //smoother line
    ctx.beginPath();
    ctx.moveTo(x, y);
}

//mousemove event draw shapes
const drawShape = ({clientX: x, clientY: y}) => {
    if(!isDrawing) return;

    drawingSettings();
    generateShape(x, y); 
}

//mouseup event
const stop = () => {
    isDrawing = false;
    //starts a new path; so that next draw doesn't originate from previous point
    ctx.beginPath();
}

//apply specified thickness and colour to drawing
const drawingSettings = () => {
    ctx.lineWidth = slider.value;
    ctx.strokeStyle = colourChosen;
}

//set canvas width and height to window width and height
const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

//clear drawing area
const clearCanvas = () => {
    //clear at x, y starting coordinates for entire canvas width and height 
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    isDrawShape = false;
    shapeChosen = undefined;
}

//generating button elements from arrays; guard prevents accumulative colours being added every click
const generateHTML = (array, domVar) => {
    if(array === colourArr){
        array.map(curr => {
            domVar.insertAdjacentHTML('afterbegin', 
                `
                    <button class="colour-box center transition rounded-border" data-colour="${curr}">
                        <svg class="icon-large transition">
                            <use href="./res/symbol-defs.svg#icon-brush"></use>
                        </svg>
                    </button>
                `
            );

            document.querySelector('.colour-box').style.backgroundColor = `${curr}`;
        });
    }

    if(array === shapeArr){
        array.map(curr => {
            domVar.insertAdjacentHTML('beforeend', 
                `
                    <button class="colour-shape center transition rounded-border" data-shape="${curr}">
                        <h3 class="h3">${curr}</h3>

                        <svg class="icon-large icon-large-shapes transition">
                            <use href="./res/symbol-defs.svg#icon-thumbs-o-up"></use>
                        </svg>
                    </button>
                `
            );
        });
    }
}

//draw the shape based on whatever shape chosen
const generateShape = (xPos, yPos) => {
    if(shapeChosen ==='square') ctx.strokeRect(xPos, yPos, 150, 150);

    if(shapeChosen === 'rectangle') ctx.strokeRect(xPos, yPos, 150, 300);

    if(shapeChosen === 'triangle') {
        ctx.moveTo(xPos, yPos);
        //draw lines based on mouse position
        ctx.lineTo(xPos+65, yPos+125);
        ctx.lineTo(xPos-65, yPos+125);
        //automatically draws remaining line
        ctx.closePath();
        ctx.stroke();
    }

    if(shapeChosen == 'circle') {
        ctx.arc(xPos, yPos, 50, 0, 2 * Math.PI);
        ctx.stroke();
    }

    if(shapeChosen === 'heart') {
        ctx.bezierCurveTo(xPos+75,yPos+37,xPos+70,yPos+25,xPos+50,yPos+25);
        ctx.bezierCurveTo(xPos+20,yPos+25,xPos+20,yPos+62.5,xPos+20,yPos+62.5);
        ctx.bezierCurveTo(xPos+20,yPos+80,xPos+40,yPos+102,xPos+75,yPos+120);
        ctx.bezierCurveTo(xPos+110,yPos+102,xPos+130,yPos+80,xPos+130,yPos+62.5);
        ctx.bezierCurveTo(xPos+130,yPos+62.5,xPos+130,yPos+25,xPos+100,yPos+25);
        ctx.bezierCurveTo(xPos+85,yPos+25,xPos+75,yPos+37,xPos+75,yPos+40);
        ctx.stroke();
    }
}

//show specified dom element
const show = (domVar) => {
    domVar.classList.remove('hidden');
}

//show popup background with selected content
const showAll = (popup, popupContent) => {
    show(popup);
    show(popupContent);
}

//hide specified dom element
const hide = (domVar) => {
    domVar.classList.add('hidden');
}

//hide all popup elements
const hideAll = () => {
    hide(popup);
    hide(popupColourPicker);
    hide(popupThickness);
    hide(popupShapes);
}

const toggleShapeBtn = (bool) => {
    bool ? shapeBtn.style.backgroundColor = '#0f0' : shapeBtn.style.backgroundColor = '#f00';
}

const percentageChange = () => {
    sliderPercentage.textContent = `${sliderBtn.value}%`;
    console.log(sliderPercentage.value);
}

resizeCanvas();



/*EVENT LISTENERS*/
window.addEventListener('resize', resizeCanvas);

canvas.addEventListener('mousedown', (e) => {
    !shapeChosen ? start(e) : startShape(e);
});

/*canvas.addEventListener('mousemove', draw);*/
canvas.addEventListener('mousemove', (e) => {
    isDrawShape === false ? draw(e) : drawShape(e);
});

canvas.addEventListener('mouseup', stop);

btnsPanel.addEventListener('click', (e) => {
    if(e.target.closest('.btn-colour')) {
        showAll(popup, popupColourPicker);

        if(!picker.hasChildNodes()){
            generateHTML(colourArr, picker);
        }
    }

    if(e.target.closest('.btn-thickness')) {
        showAll(popup, popupThickness);
    }

    if(e.target.closest('.btn-shapes')) {
        showAll(popup, popupShapes);

        if(!shapes.hasChildNodes()){
            generateHTML(shapeArr, shapes);
        }
    }

    if(e.target.closest('.btn-clear')) {
        clearCanvas();
        toggleShapeBtn(false);
    }
})

popup.addEventListener('click', (e) => {
    //close popup when background is clicked
    if(e.target.classList.contains('popup')) {
        hideAll();
    }
})

//event delegation for which child colour button was clicked
picker.addEventListener('click', (e) => {
    //dataset property is whatever was written after the 'data-' attribute
    colourChosen = e.target.closest('.colour-box').dataset.colour;

    colourBtn.style.backgroundColor = `${colourChosen}`;
    hideAll();
})

slider.addEventListener('input', () => {
    sliderPercentage.textContent = `${slider.value}%`;
})

sliderBtn.addEventListener('click', () => {
    ctx.lineWidth = slider.value;
    hideAll();
})

shapes.addEventListener('click', (e) => {
    shapeChosen = e.target.closest('.colour-shape').dataset.shape;

    hideAll();
    isDrawShape = true;
    toggleShapeBtn(true);
})
const canvas = document.getElementById('canvas');
let selectedElement = null;
let isDragging = false;
let isResizing = false;
let offsetX, offsetY;
let startX, startY, startWidth, startHeight;

// Function to add new elements to the canvas
function addElement(tag, content, styles) {
    const newElement = document.createElement(tag);
    
    if (tag === 'img') {
        newElement.src = content;
        newElement.alt = "Uploaded Image";
        newElement.style.width = '100px';
        newElement.style.height = 'auto';
    } else {
        newElement.innerHTML = content;
    }

    Object.assign(newElement.style, styles);
    newElement.classList.add('element');

    // Add resize handle for the element
    const resizeHandle = document.createElement('div');
    resizeHandle.classList.add('resize-handle');
    newElement.appendChild(resizeHandle);

    // Add event listeners for dragging and resizing
    newElement.addEventListener('mousedown', startDrag);
    resizeHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        initResize(newElement, e);
    });

    canvas.appendChild(newElement);
}

// Function to start dragging the element
function startDrag(e) {
    if (e.target.classList.contains('resize-handle')) return;
    isDragging = true;
    selectedElement = e.target;
    offsetX = e.clientX - selectedElement.getBoundingClientRect().left;
    offsetY = e.clientY - selectedElement.getBoundingClientRect().top;

    document.addEventListener('mousemove', dragElement);
    document.addEventListener('mouseup', stopDrag);
}

// Function to drag the selected element
function dragElement(e) {
    if (!isDragging) return;
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;
    selectedElement.style.left = `${newX}px`;
    selectedElement.style.top = `${newY}px`;
}

// Function to stop dragging
function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', dragElement);
    document.removeEventListener('mouseup', stopDrag);
}

// Resize function
function initResize(element, e) {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(window.getComputedStyle(element).width, 10);
    startHeight = parseInt(window.getComputedStyle(element).height, 10);

    document.addEventListener('mousemove', (e) => resizeElement(e, element));
    document.addEventListener('mouseup', stopResize);
}

function resizeElement(e, element) {
    if (isResizing) {
        const width = startWidth + (e.clientX - startX);
        const aspectRatio = startWidth / startHeight;
        
        element.style.width = `${width}px`;
        if (element.tagName === 'IMG') {
            element.style.height = `${width / aspectRatio}px`;
        } else {
            const height = startHeight + (e.clientY - startY);
            element.style.height = `${height}px`;
        }
    }
}

function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', resizeElement);
    document.removeEventListener('mouseup', stopResize);
}

// Add template functions
function loadTemplate(content) {
    canvas.innerHTML = '';
    content.forEach(item => addElement(item.tag, item.content, item.styles));
}

document.getElementById('template1').addEventListener('click', () => {
    const template1 = [
        { tag: 'div', content: 'Welcome to Template 1!', styles: { top: '20px', left: '20px', fontSize: '24px', color: '#000' } },
        { tag: 'button', content: 'Click Me', styles: { top: '60px', left: '20px', fontSize: '20px', backgroundColor: '#ff69b4', color: '#fff' } },
        { tag: 'div', content: 'This is some text.', styles: { top: '120px', left: '20px', fontSize: '18px', color: '#333' } },
        // Add more elements for up to 15 lines
    ];
    loadTemplate(template1);
});

document.getElementById('template2').addEventListener('click', () => {
    const template2 = [
        { tag: 'div', content: 'Template 2 Heading!', styles: { top: '20px', left: '20px', fontSize: '24px', color: '#000' } },
        { tag: 'button', content: 'Sign Up', styles: { top: '60px', left: '20px', fontSize: '20px', backgroundColor: '#ffa500', color: '#fff' } },
        { tag: 'div', content: 'More content goes here.', styles: { top: '120px', left: '20px', fontSize: '18px', color: '#333' } },
        // Add more elements for up to 15 lines
    ];
    loadTemplate(template2);
});

document.getElementById('template3').addEventListener('click', () => {
    const template3 = [
        { tag: 'div', content: 'Welcome to Template 3', styles: { top: '20px', left: '20px', fontSize: '24px', color: '#000' } },
        { tag: 'button', content: 'Learn More', styles: { top: '60px', left: '20px', fontSize: '20px', backgroundColor: '#32cd32', color: '#fff' } },
        { tag: 'div', content: 'Some description text.', styles: { top: '120px', left: '20px', fontSize: '18px', color: '#333' } },
        // Add more elements for up to 15 lines
    ];
    loadTemplate(template3);
});

// Add event listeners for adding elements
document.getElementById('add-text').addEventListener('click', () => addElement('div', 'New Text', { left: '10px', top: '10px', fontSize: '16px', color: '#000', backgroundColor: '#ffdab9', position: 'absolute' }));
document.getElementById('add-button').addEventListener('click', () => addElement('button', 'New Button', { left: '10px', top: '10px', fontSize: '20px', backgroundColor: '#ff69b4', color: '#fff', position: 'absolute' }));

// Image upload functionality
document.getElementById('image-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            addElement('img', event.target.result, { left: '10px', top: '10px', position: 'absolute' });
        };
        reader.readAsDataURL(file);
    }
});

// Customization panel updates
document.getElementById('element-text').addEventListener('input', () => {
    if (selectedElement && selectedElement.tagName !== 'IMG') {
        selectedElement.innerHTML = document.getElementById('element-text').value;
    }
});

document.getElementById('element-color').addEventListener('input', () => {
    if (selectedElement) {
        selectedElement.style.color = document.getElementById('element-color').value;
    }
});

document.getElementById('element-font-size').addEventListener('input', () => {
    if (selectedElement) {
        selectedElement.style.fontSize = `${document.getElementById('element-font-size').value}px`;
    }
});

document.getElementById('element-bg-color').addEventListener('input', () => {
    if (selectedElement) {
        selectedElement.style.backgroundColor = document.getElementById('element-bg-color').value;
    }
});

document.getElementById('element-font-weight').addEventListener('input', () => {
    if (selectedElement) {
        selectedElement.style.fontWeight = document.getElementById('element-font-weight').value;
    }
});

// Apply changes button
document.getElementById('apply-changes').addEventListener('click', () => {
    if (selectedElement) {
        const newText = document.getElementById('element-text').value;
        const newColor = document.getElementById('element-color').value;
        const newFontSize = document.getElementById('element-font-size').value;
        const newBgColor = document.getElementById('element-bg-color').value;
        const newFontWeight = document.getElementById('element-font-weight').value;

        if (selectedElement.tagName !== 'IMG') {
            selectedElement.innerHTML = newText;
        }
        selectedElement.style.color = newColor;
        selectedElement.style.fontSize = `${newFontSize}px`;
        selectedElement.style.backgroundColor = newBgColor;
        selectedElement.style.fontWeight = newFontWeight;
    }
});

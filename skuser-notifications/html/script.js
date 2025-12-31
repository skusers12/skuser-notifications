const wrapper = document.createElement('div');
wrapper.id = 'notifications-wrapper';
document.body.appendChild(wrapper);

const activeNotifications = {};

const TYPES = {
    success: { color: '#40c057', icon: 'circle-check' },
    error:   { color: '#fa5252', icon: 'circle-xmark' },
    warning: { color: '#fab005', icon: 'triangle-exclamation' },
    info:    { color: '#228be6', icon: 'circle-info' },
    normal:  { color: '#ffffff', icon: 'bell' } 
};

function parseMarkdown(text) {
    if (!text) return '';
    let html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
        .replace(/\*(.*?)\*/g, '<em>$1</em>')             
        .replace(/__(.*?)__/g, '<u>$1</u>')               
        .replace(/`(.*?)`/g, '<code>$1</code>')           
        .replace(/~~(.*?)~~/g, '<del>$1</del>')           
        .replace(/\n/g, '<br>');                         
    return html;
}

function notify(data) {
    const {
        id,
        title,
        description,
        duration = 3000,
        position = 'top',
        type = 'normal',
        style = {},
        icon,
        iconColor,
        showDuration = true,
        sound = false 
    } = data;

    if (id && activeNotifications[id]) {
        removeNotification(id, true);
    }

    const typeConfig = TYPES[type] || TYPES.normal;
    const finalIcon = icon || typeConfig.icon;
    const finalColor = iconColor || typeConfig.color;
    
    const faIcon = finalIcon.includes('fa-') ? finalIcon : `fa-solid fa-${finalIcon}`;

    let group = document.querySelector(`.notify-group.${position}`);
    if (!group) {
        group = document.createElement('div');
        group.className = `notify-group ${position}`;
        wrapper.appendChild(group);
    }

    const card = document.createElement('div');
    card.className = 'notify-card';
    if (id) card.dataset.id = id;

    card.innerHTML = `
        <div class="notify-body">
            <div class="notify-icon" style="color: ${finalColor}">
                <i class="${faIcon}"></i>
            </div>
            <div class="notify-content">
                ${title ? `<div class="notify-title">${title}</div>` : ''}
                ${description ? `<div class="notify-description">${parseMarkdown(description)}</div>` : ''}
            </div>
        </div>
        ${showDuration ? `<div class="notify-progress" style="background-color: ${finalColor}"></div>` : ''}
    `;

    applyDeepStyles(card, style);

    group.appendChild(card);

    if (sound) {
        const audio = new Audio('notify.mp3'); 
        audio.volume = 0.2;
        audio.play().catch(() => {});
    }

    if (showDuration) {
        const bar = card.querySelector('.notify-progress');
        if (bar) {
            bar.style.animation = `timerBar ${duration}ms linear forwards`;
        }
    }

    const timer = setTimeout(() => {
        removeNotification(id || card, false);
    }, duration);

    if (id) {
        activeNotifications[id] = { element: card, timer: timer };
    } else {
        card._timer = timer;
    }
}

function removeNotification(identifier, instant = false) {
    let card, timer;

    if (typeof identifier === 'string') {
        const data = activeNotifications[identifier];
        if (!data) return;
        card = data.element;
        timer = data.timer;
        delete activeNotifications[identifier];
    } else {
        card = identifier;
        timer = card._timer;
    }

    clearTimeout(timer);

    if (instant) {
        card.remove();
    } else {
        card.classList.add('closing');
        card.addEventListener('animationend', () => {
            card.remove();
        });
    }
}

function applyDeepStyles(element, styles) {
    if (!styles) return;

    for (const [key, value] of Object.entries(styles)) {
        if (key.startsWith('.') || key.startsWith('#') || key.includes(' ')) {
            const target = element.querySelector(key);
            if (target && typeof value === 'object') {
                Object.assign(target.style, value);
            }
        } else {
            element.style[key] = value;
        }
    }
}

window.addEventListener('message', (event) => {
    if (event.data.action === 'notify') {
        notify(event.data);
    }
});

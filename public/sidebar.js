// sidebar.js
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-sidebar');
const body = document.body;

function toggleSidebar() {
    if (window.innerWidth > 768) {
        sidebar.classList.toggle('collapsed');
        body.classList.toggle('collapsed');
    }
}

function setActive(element) {
    if (!element) return;
    document.querySelectorAll('.menu li').forEach(item => {
        item.classList.remove('active');
    });
    element.classList.add('active');
}

if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleSidebar);
} else {
    console.warn('Toggle button not found');
}

document.querySelectorAll('.menu li').forEach(item => {
    item.addEventListener('click', function() {
        setActive(this);
    });
});

function handleResponsiveSidebar() {
    if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
        body.classList.add('collapsed');
    }
}

window.addEventListener('load', handleResponsiveSidebar);
window.addEventListener('resize', handleResponsiveSidebar);

window.SidebarManager = {
    init: function() {
        console.log('SidebarManager initialized');
    }
};
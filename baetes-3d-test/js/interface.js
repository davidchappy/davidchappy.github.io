// Overlay header
const overlayHeader = document.querySelector('.product__header');
const closeButton = document.querySelector('.product__header-close');
const leftButton = document.querySelector('.product__header-left');
const rightButton = document.querySelector('.product__header-right');

// Side bar elements
const sidebar = document.querySelector('.product__sidebar');
const sidebarHandle = document.querySelector('.product__sidebar-handle-button button');
const sidebarHandleIcon = document.querySelector('.product__sidebar-handle-button span');
const addToCartButton = document.querySelector('.product__sidebar-add');
const metaTabs = document.querySelectorAll('.product__sidebar-meta-titles a');
const metaContents = document.querySelectorAll('.product__sidebar-meta-content');

function makeTabVisible(tabElement) {
  hideTabs();

  tabElement.classList.add('visible');
  const targetId = tabElement.getAttribute('data-show');
  const currentContent = document.querySelector('#' + targetId);
  currentContent.classList.add('visible');
}

function hideTabs() {
  for (let i=0; i<metaTabs.length; i++) {
    const tabEl = metaTabs[i];
    tabEl.classList.remove('visible');
  }
  for (let i=0; i<metaContents.length; i++) {
    const content = metaContents[i];
    content.classList.remove('visible');
  }
}

function toggleOverlay() {
  const visible = overlayHeader.classList.contains('visible');
  if (visible) {
    hideOverlayHeader();
    hideSidebar();
  } else {
    showOverlayHeader();
    showSidebar();
  }
}

function toggleSidebar() {
  const visible = sidebar.classList.contains('visible');
  if (visible) {
    hideSidebar();
  } else {
    showSidebar();
  }
}

function showOverlayHeader() {
  if (!overlayHeader.classList.contains('visible')) {
    overlayHeader.classList.add('visible');
  }
  rotating = false;    
}

function hideOverlayHeader() {
  overlayHeader.classList.remove('visible');
  rotating = true;  
}

function showSidebar() {
  sidebar.classList.add('visible');
  sidebarHandleIcon.classList.remove('fa-chevron-left');
  sidebarHandleIcon.classList.add('fa-chevron-right');

  showOverlayHeader();
}

function hideSidebar() {
  sidebar.classList.remove('visible');
  sidebarHandleIcon.classList.remove('fa-chevron-right');
  sidebarHandleIcon.classList.add('fa-chevron-left');
}

function listen() {
  // Clicking sidebar handle (slide open/closed)
  sidebarHandle.addEventListener('click', function(event) {
    toggleSidebar();
  });

  // Clicking overlay close button
  closeButton.addEventListener('click', function(event) {
    toggleOverlay();
  });

  // Clicking any product meta content tab (Description, etc.)
  for (let i=0; i<metaTabs.length; i++) {
    const tab = metaTabs[i];
    tab.addEventListener('click', function(event) {
      makeTabVisible(tab);
    });
  }


}

listen();

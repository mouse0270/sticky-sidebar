// CORE MODULE IMPORT
import { MODULE } from './_module.mjs';

// IMPORT SETTINGS -> Settings Register on Hooks.Setup
import './_settings.mjs';

// IMPORT MODULE FUNCTIONALITY
import { StickySidebar } from './module.mjs';

Hooks.once('init', async function() {

});

Hooks.once('ready', async function() {
	StickySidebar.changeSidebarTab();

	let resizing = false;
	let $element = null;
	$('#sidebar').on('mousedown', 'section[data-tab].sticky .ss-resizer', (event) => {
		resizing = true;
		$element = $(event.target).closest('section[data-tab]');
	}).on('mousemove', (event) => {
		if (resizing) {
			let newHeight = $(window).height() - event.originalEvent.pageY;

			if ($element.data('tab') != 'chat') {
				if (typeof $element.nextAll('section[data-tab].sticky') != 'undefined') {
					$element.nextAll('section[data-tab].sticky').each((index, stickyEl) => {
						if (!$(stickyEl).hasClass('active')) {
							newHeight -= $(stickyEl).height() || 0;
						}
					});
					if (!$('#sidebar section[data-tab="chat"]').hasClass('active')) {
						newHeight -= $('#sidebar section[data-tab="chat"].sticky').height() || 0;
					}
				}
			}
			$element.attr('style', `flex: 0 0 ${newHeight < 300 ? 300 : newHeight}px !important`)
		}
	}).on('mouseup', (event) => {
		// update variable
		if (resizing) {
			let tabHeight = {};
			tabHeight[$('#sidebar section[data-tab].active').data('tab')] = {};
			tabHeight[$('#sidebar section[data-tab].active').data('tab')][$element.data('tab')] = $element.attr('style');
				
			//update height
			MODULE.setting('stickyHeight', foundry.utils.mergeObject(MODULE.setting('stickyHeight'), tabHeight, { inplace: false }));

			resizing = false;
			$element = null;
		}
	})
});
Hooks.on('changeSidebarTab', async function() {	
	StickySidebar.changeSidebarTab();
});
Hooks.on('renderSidebarTab', async function() {	
	StickySidebar.changeSidebarTab();
});

// Patch Foundry
Hooks.on('libWrapper.Ready', async () => {
	libWrapper.register('sticky-sidebar', 'Tabs.prototype._onClickNav', function(event) {
		const tab = event.target.closest("[data-tab]");
		if ( !tab ) return;
		event.preventDefault();
		const tabName = tab.dataset.tab;
		if (tabName !== this.active || $('#sidebar').hasClass('collapsed')) this.activate(tabName, {triggerCallback: true});
	}, 'OVERRIDE');
});
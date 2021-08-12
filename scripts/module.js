let stickySidebar = null;
Hooks.once('sticky-sidebarIsLoaded', async () => {
	class StickySidebar extends MousesLib {
		constructor(module) {
			super(module)
		}

		init = () => {
			let sideBarOptions = {
				"none": 		"None",
			  	"chat": 		"Chat",
				"combat": 		"Combat",
				"scenes": 		"scenes",
				"actors": 		"actors",
				"items": 		"items",
				"journal": 		"journal",
				"tables": 		"tables",
				"playlists": 	"playlists",
				"compendium": 	"compendium",
				"settings": 	"Settings"
			}

			// Add Setting for Option 1
			this.setting('register', 'stickyOption1', {
				type: String,
				choices: sideBarOptions,
				default: "chat",
				onChange: value => this.changeSidebarTab()
			});

			// Add Setting for Option 2
			this.setting('register', 'stickyOption2', {
				type: String,
				choices: sideBarOptions,
				default: "none",
				onChange: value => this.changeSidebarTab()
			});
			// Save Height
			this.setting('register', 'stickyHeight', {
				type: Object,
				default: {},
				config: false
			});
		}

		changeSidebarTab = () => {
			let setting = {
				option1: stickySidebar.setting(`stickyOption1`),
				option2: stickySidebar.setting(`stickyOption2`)
			}
	
			// Remove Sticky Elements
			document.querySelectorAll(`#sidebar section[data-tab].sticky`).forEach(element => {
				element.classList.remove('sticky');
			});

			// Add Sticky Elements
			for (const [key, value] of Object.entries(setting)) {
				let element = document.querySelector(`#sidebar section[data-tab="${value}"]`);
				$(element).find('.ss-resizer').remove();
				if ($(element).length) {
					$(element).addClass("sticky");
					$(element).prepend('<div class="ss-resizer"></div>');
				}

				if ($(element).hasClass('active'))
					$(element).removeAttr('style');

				let stickyHeight = this.setting('stickyHeight');
				let activeTab = $('#sidebar section[data-tab].active').data('tab');
				if (typeof stickyHeight[activeTab] != 'undefined') {
					if (typeof stickyHeight[activeTab][value] != 'undefined') {
						$(element).attr('style', stickyHeight[activeTab][value]);
					}
				}
			}
			//$('#sidebar section[data-tab].active.sticky').removeAttr('style');
		}
	}

	// Register Module	
	stickySidebar = new StickySidebar({
		name: 'sticky-sidebar',
		title: 'Sticky Sidebar',
	});
	Hooks.callAll(`${stickySidebar.MODULE.name}Init`);	

	stickySidebar.init();

	Hooks.once('ready', async function() {		
		stickySidebar.changeSidebarTab();

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
				stickySidebar.setting('stickyHeight', Object.extend(stickySidebar.setting('stickyHeight'), tabHeight))

				resizing = false;
				$element = null;
			}
		})
	});

	Hooks.on('changeSidebarTab', async function() {	
		stickySidebar.changeSidebarTab();
	});
	Hooks.on('renderSidebarTab', async function() {	
		stickySidebar.changeSidebarTab();
	});
	//Hooks.on()
});
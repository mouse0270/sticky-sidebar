import { MODULE } from "./_module.mjs";

export class StickySidebar {
	static changeSidebarTab = () => {
		let setting = {
			option1: MODULE.setting(`stickyOption1`),
			option2: MODULE.setting(`stickyOption2`)
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

			let stickyHeight = MODULE.setting('stickyHeight');
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

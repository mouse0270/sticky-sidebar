import { MODULE } from './_module.mjs';
// IMPORT MODULE FUNCTIONALITY
import { StickySidebar } from './module.mjs';


Hooks.once('setup', () => {
	const sideBarOptions = {
		"none": 		MODULE.localize('SIDEBAR.none'),
		"chat": 		game.i18n.localize('SIDEBAR.TabChat'),
		"combat": 		game.i18n.localize('SIDEBAR.TabCombat'),
		"scenes": 		game.i18n.localize('SIDEBAR.TabScenes'),
		"actors": 		game.i18n.localize('SIDEBAR.TabActors'),
		"items": 		game.i18n.localize('SIDEBAR.TabItems'),
		"journal": 		game.i18n.localize('SIDEBAR.TabJournal'),
		"tables": 		game.i18n.localize('SIDEBAR.TabTables'),
		"playlists": 	game.i18n.localize('SIDEBAR.TabPlaylists'),
		"compendium": 	game.i18n.localize('SIDEBAR.TabCompendium'),
		"settings": 	game.i18n.localize('SIDEBAR.TabSettings')
	}

	// Add Setting for Option 1
	MODULE.setting('register', 'stickyOption1', {
		type: String,
		choices: sideBarOptions,
		default: "chat",
		onChange: value => StickySidebar.changeSidebarTab()
	});

	// Add Setting for Option 2
	MODULE.setting('register', 'stickyOption2', {
		type: String,
		choices: sideBarOptions,
		default: "none",
		onChange: value => StickySidebar.changeSidebarTab()
	});
	
	// Save Height
	MODULE.setting('register', 'stickyHeight', {
		type: Object,
		default: {},
		config: false
	});
});
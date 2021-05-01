import {JetView, plugins} from "webix-jet";

import events from "../constants/events";

export default class Menu extends JetView {
	config() {
		return {
			view: "menu",
			id: "topMenu",
			width: 200,
			layout: "y",
			select: true,
			data: [
				{id: "contacts", value: "Contacts", icon: "fas fa-users"},
				{id: "activities", value: "Activities", icon: "fas fa-cogs"},
				{id: "settings", value: "Settings", icon: "fas fa-calendar-week"}
			],
			on: {
				onAfterSelect(id) {
					const menuItem = this.getItem(id);
					this.$scope.app.callEvent(events.HEADER_PAGE_TITLE_CHANGE, [menuItem.value]);
				}
			}
		};
	}

	init() {
		this.use(plugins.Menu, "topMenu");
	}
}

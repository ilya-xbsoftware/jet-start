import {JetView, plugins} from "webix-jet";

import events from "../constants/events";

export default class Menu extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			view: "menu",
			id: "topMenu",
			width: 200,
			layout: "y",
			select: true,
			data: [
				{id: "contacts", value: _("contacts"), icon: "fas fa-users"},
				{id: "activities", value: _("activities"), icon: "fas fa-cogs"},
				{id: "settings", value: _("settings"), icon: "fas fa-calendar-week"}
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

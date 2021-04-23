import {JetView, plugins} from "webix-jet";

import METHOD_NAME from "../constants/gloabalUrlChanger";

export default class Menu extends JetView {
	config() {
		return {
			view: "menu",
			id: "top:menu",
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
					this.$scope.app.callEvent(`${METHOD_NAME}`, [menuItem.value]);
				}
			}
		};
	}

	init() {
		this.use(plugins.Menu, "top:menu");
	}
}

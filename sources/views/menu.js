import {JetView, plugins} from "webix-jet";

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
			]
		};
	}

	init() {
		this.use(plugins.Menu, "top:menu");
	}
}

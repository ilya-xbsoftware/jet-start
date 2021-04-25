import {JetView} from "webix-jet";

import events from "../constants/events";

export default class Header extends JetView {
	config() {
		return {
			view: "toolbar",
			localId: "header",
			cols: [
				{
					view: "label",
					localId: "header-title",
					name: "projects",
					css: "toolbar"
				}
			]
		};
	}

	init() {
		this.headerTitle = this.$$("header-title");
		this.on(this.app, events.HEADER_PAGE_TITLE_CHANGE, (title) => {
			this.headerTitle.setValue(title);
		});
	}
}

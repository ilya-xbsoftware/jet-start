import {JetView} from "webix-jet";

import METHOD_NAME from "../constants/gloabalUrlChanger";

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
		this.on(this.app, `${METHOD_NAME}`, (title) => {
			const titleWithСapitalLetter = this._capitalizeFirstLetter(title);
			this.headerTitle.setValue(titleWithСapitalLetter);
		});
	}

	_capitalizeFirstLetter(string) {
		return string[0].toUpperCase() + string.slice(1);
	}
}

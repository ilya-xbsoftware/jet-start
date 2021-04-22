import {JetView} from "webix-jet";

export default class Toolbar extends JetView {
	config() {
		return {
			view: "toolbar",
			localId: "toolbar",
			cols: [
				{view: "label", name: "projects", css: "toolbar"}
			]
		};
	}

	init() {
		this.toolbar = this.$$("toolbar");
	}

	urlChange(view, url) {
		const title = url[1].page;

		this.toolbar.setValues({
			projects: this._capitalizeFirstLetter(title)
		});
	}

	_capitalizeFirstLetter(string) {
		return string[0].toUpperCase() + string.slice(1);
	}
}

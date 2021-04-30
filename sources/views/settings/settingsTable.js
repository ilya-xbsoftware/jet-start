import {JetView} from "webix-jet";

export default class SettingsTable extends JetView {
	constructor(app, name, data, tabName) {
		super(app, name);
		this.data = data;
		this.tabName = tabName;
	}

	config() {
		return {
			view: "datatable",
			localId: "settingsTable",
			select: "row",
			scroll: "auto",
			editable: true,
			edication: "dblclick",
			template: "<i class='fas fa-trash-alt delete-btn'></i>",
			onClick: {
				"delete-btn": (e, id) => {
					if (id) {
						webix.confirm({type: "confirm-message", text: "Are you sure?"})
							.then(() => {
								this.data.remove(id);
							});
					}
				}
			},
			columns: [
				{
					id: "Value",
					header: "Value",
					fillspace: true
				},
				{
					id: "Icon",
					header: "Icon",
					fillspace: true
				}
			]
		};
	}

	init() {
		this.$$("settingsTable").sync(this.data);
		this.$$("settingsTable").attachEvent("onViewShow", () => {
			console.log(this.tabName);
		});
	}
}

import {JetView} from "webix-jet";

export default class PopupView extends JetView {
	constructor(app, name, data, type) {
		super(app, name);
		this.data = data;
		this.type = type;
	}

	config() {
		return {
			view: "window",
			position: "center",
			move: true,
			close: true,
			head: `${this.type} activity`,
			body: {
				view: "form",
				localId: "popup",
				width: 500,
				elements: [
					{
						view: "textarea",
						label: "Details",
						name: "Details",
						height: 150,
						invalidMessage: "text"
					},
					{
						view: "combo",
						label: "Type",
						name: "ActivityType",
						options: this.data,
						invalidMessage: "text"
					},
					{
						view: "combo",
						label: "Contact",
						name: "Contact",
						options: this.data,
						invalidMessage: "text"},
					{
						cols: [
							{
								view: "datepicker",
								label: "Date",
								name: "Date",
								value: new Date(),
								invalidMessage: "text"},
							{
								view: "datepicker",
								label: "Time",
								name: "Time",
								value: new Date(),
								type: "time",
								timepicker: true,
								invalidMessage: "text"}
						]
					},
					{
						view: "checkbox",
						labelRight: "Completed",
						value: 1
					},
					{
						cols: [
							{},
							{
								padding: 20,
								cols: [
									{view: "button", label: "Save"},
									{view: "button", label: "Cancel"}
								]
							}
						]
					}
				],
				rules: {
					Details: webix.rules.isNotEmpty,
					ActivityType: webix.rules.isNotEmpty,
					Contact: webix.rules.isNotEmpty,
					Date: webix.rules.isNotEmpty,
					Time: webix.rules.isNotEmpty
				}

			}
		};
	}

	init() {
		this.on(this.app, "onDataEditStop", () => {
			this.getRoot().getBody().clear();
			this.getRoot().hide();
		});
	}

	showWindow() {
		this.getRoot().show();
	}

	hideWindow() {
		this.getRoot().hide();
	}
}

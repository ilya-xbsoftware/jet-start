import {JetView} from "webix-jet";

export default class SettingsTable extends JetView {
	constructor(app, name, data, icons) {
		super(app, name);
		this.data = data;
		this.icons = icons;
	}

	config() {
		const _ = this.app.getService("locale")._;

		return {
			rows: [
				{
					view: "form",
					localId: "settingsForm",
					cols: [
						{
							view: "text",
							localId: "inputType",
							label: _("type"),
							name: "type",
							validate: webix.rules.isNotEmpty,
							labelAlign: "center"
						},
						{
							view: "richselect",
							options: this.icons,
							localId: "inputIcon",
							label: _("icon"),
							name: "icon",
							validate: webix.rules.isNotEmpty,
							labelAlign: "center"
						},
						{
							view: "button",
							value: _("addNew"),
							width: 100,
							css: "webix_primary",
							click: () => this._addNewRow()
						},
						{}
					]
				},
				{
					view: "datatable",
					localId: "settingsTable",
					select: "row",
					scrollX: false,
					scrollY: true,
					editable: true,
					editaction: "dblclick",
					onClick: {
						"delete-btn": (e, id) => {
							if (id) {
								webix.confirm({
									title: _("areYouSure"),
									ok: _("ok"),
									cancel: _("cancel")
								})
									.then(() => {
										this.data.remove(id);
									});
							}
						}
					},
					columns: [
						{
							id: "Value",
							header: _("value"),
							editor: "text",
							fillspace: true
						},
						{
							id: "Icon",
							header: _("icon"),
							editor: "richselect",
							options: this.icons,
							fillspace: true
						},
						{
							template: "<i class='fas fa-trash-alt delete-btn'></i>"
						}
					]
				}
			]
		};
	}

	init() {
		this.$$("settingsTable").sync(this.data);
		this._form = this.$$("settingsForm");
		this._typeInput = this.$$("inputType");
		this._iconInput = this.$$("inputIcon");
		this.getInputHeader = this.$$("valueHeader");
	}


	_addNewRow() {
		const _ = this.app.getService("locale")._;
		const getTypeFromInput = this._typeInput.getValue();
		const getIconFromInput = this._iconInput.getValue();

		if (this._form.validate()) {
			this.data.waitSave(() => {
				this.data.add({
					Value: getTypeFromInput,
					Icon: getIconFromInput
				});
			})
				.then(() => {
					webix.message({
						type: "success",
						text: _("addedMessage")
					});
					this._form.clear();
				});
		}
		else {
			webix.message({type: "error", text: "Please enter values"});
		}
	}
}

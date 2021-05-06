import {JetView} from "webix-jet";

import {confirmMessage} from "../../utils/utils";

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
							localId: "inputIcon",
							label: _("icon"),
							name: "icon",
							options: {
								body: {
									data: this.icons,
									template: obj => `<div class="settings-richselect-icons">
                                      <i class="fas fa-${obj.value}"></i>
                                      <span>${obj.value}</span>
                                    </div>`
								}
							},
							validate: webix.rules.isNotEmpty,
							labelAlign: "center"
						},
						{
							view: "button",
							value: _("addNew"),
							autowidth: true,
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
					on: {
						onBeforeEditStop: (state) => {
							if (!state.value) {
								webix.message({
									type: "error",
									text: _("emptyError")
								});
								return false;
							}
							return true;
						}
					},
					onClick: {
						"delete-btn": (e, id) => {
							if (id) {
								confirmMessage(_, "areYouSure")
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
							suggest: {
								body: {
									template: obj => this._getIconColumnTemplate(obj.value)
								}
							},
							collection: this.icons,
							template: obj => this._getIconColumnTemplate(obj.Icon),
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

	_getIconColumnTemplate(item) {
		return `<div class="settings-richselect-icons">
              <i class="fas fa-${item}"></i>
              <span>${item}</span>
            </div>`;
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

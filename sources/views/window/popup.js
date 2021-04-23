import {JetView} from "webix-jet";

import activities from "../../models/activities";
import activityTypes from "../../models/activityTypes";
import contacts from "../../models/contacts";

export default class PopupView extends JetView {
	constructor(app, name, id) {
		super(app, name);
		this._id = id;
	}

	config() {
		return {
			view: "window",
			localId: "popup",
			position: "center",
			move: true,
			modal: true,
			head: {
				template: "#title# activity",
				localId: "title"
			},
			width: 600,
			body: {
				view: "form",
				localId: "form",
				elements: [
					{
						view: "textarea",
						label: "Details",
						name: "Details"
					},
					{
						view: "richselect",
						label: "Type",
						name: "TypeID",
						options: {
							view: "suggest",
							body: {
								view: "list",
								data: activityTypes,
								template: "#value#"
							}
						},
						invalidMessage: "Type must not be empty"
					},
					{
						view: "richselect",
						label: "Contact",
						name: "ContactID",
						options: {
							view: "suggest",
							body: {
								view: "list",
								data: contacts,
								template: "#value#"
							}
						},
						invalidMessage: "Contact must not be empty"},
					{
						cols: [
							{
								view: "datepicker",
								label: "Date",
								name: "DueDate",
								format: webix.i18n.longDateFormatStr
							},
							{
								view: "datepicker",
								label: "Time",
								name: "Time",
								type: "time",
								format: webix.i18n.timeFormat,
								timepicker: true
							}
						]
					},
					{
						view: "checkbox",
						labelRight: "Completed",
						name: "State"
					},
					{
						cols: [
							{},
							{
								padding: 20,
								cols: [
									{
										view: "button",
										localId: "nameChangingBtn",
										click: () => this._saveAction(this._id)
									},
									{
										view: "button",
										value: "Cancel",
										click: () => this._hideWindow()
									}
								]
							}
						]
					}
				],
				rules: {
					TypeID: webix.rules.isNotEmpty,
					ContactID: webix.rules.isNotEmpty
				}
			}
		};
	}

	get _getForm() {
		if (!this._form) {
			this._form = this.$$("form");
		}

		return this._form;
	}

	_setTime(date, time) {
		const hours = time.getHours();
		const minutes = time.getMinutes();
		date.setHours(hours);
		date.setMinutes(minutes);
	}

	_hideWindow() {
		this._getForm.clear();
		this._getForm.clearValidation();
		this.getRoot().hide();
	}

	_saveAction(id) {
		if (!this._getForm.validate()) {
			webix.message({text: "Please check fields", type: "error"});
		}
		else {
			const formData = this._getForm.getValues();
			const date = formData.DueDate;
			const time = formData.Time;

			if (date && time) {
				this._setTime(date, time);
			}
			else if (time) {
				const currentDate = new Date();
				this._setTime(currentDate, time);
			}

			activities.waitSave(() => {
				if (id) {
					activities.updateItem(formData.id, formData);
				}
				else {
					activities.add(formData, 0);
				}
			}).then(() => {
				webix.message({text: "Updated successfully !", type: "success"});
				this._hideWindow();
			});
		}
	}

	showWindow(id) {
		this._id = id;
		const btnTitle = id ? "Edit" : "Add";
		const button = id ? "Save" : "Add";

		this.$$("title").setValues({title: btnTitle});
		this.$$("nameChangingBtn").setValue(button);

		if (id) {
			const item = activities.getItem(id);
			const newItem = {
				Time: item.DueDate,
				...this.webix.copy(item)
			};

			this._getForm.setValues(newItem);
		}
		this.getRoot().show();
	}
}

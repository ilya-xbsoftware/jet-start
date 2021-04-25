import {JetView} from "webix-jet";

import activities from "../../models/activities";
import activityTypes from "../../models/activityTypes";
import contacts from "../../models/contacts";

export default class PopupView extends JetView {
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
										click: () => this._saveAction()
									},
									{
										view: "button",
										value: "Cancel",
										click: () => this.hideWindow()
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

	_setTimeToDate(date, time) {
		const hours = time.getHours();
		const minutes = time.getMinutes();

		date.setHours(hours);
		date.setMinutes(minutes);
	}

	_saveAction() {
		if (!this._getForm.validate()) {
			webix.message({text: "Please check fields", type: "error"});
		}
		else {
			const formData = this._getForm.getValues();
			const date = formData.DueDate;
			const time = formData.Time;


			if (date && time) {
				this._setTimeToDate(date, time);
			}
			else if (time) {
				const currentDate = new Date();
				this._setTimeToDate(currentDate, time);
			}

			activities.waitSave(() => {
				if (this._editingItemId) {
					activities.updateItem(this._editingItemId, formData);
				}
				else {
					activities.add(formData);
				}
			}).then(() => {
				webix.message({text: "Updated successfully !", type: "success"});
				this.hideWindow();
			});
		}
	}

	showWindow(editingItem) {
		const popupTitle = editingItem ? "Edit" : "Add";
		const button = editingItem ? "Save" : "Add";

		this.$$("nameChangingBtn").setValue(button);
		this.$$("title").setValues({title: popupTitle});

		if (editingItem) {
			this._editingItemId = editingItem.id;
			const newItem = {
				Time: editingItem.DueDate,
				...this.webix.copy(editingItem)
			};
			this._getForm.setValues(newItem);
		}
		this.getRoot().show();
	}

	hideWindow() {
		this._getForm.clear();
		this._getForm.clearValidation();
		this.getRoot().hide();
	}
}

import {JetView} from "webix-jet";

import events from "../../constants/events";
import activities from "../../models/activities";
import activityTypes from "../../models/activityTypes";
import contacts from "../../models/contacts";

export default class PopupView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			view: "window",
			localId: "popup",
			position: "center",
			move: true,
			modal: true,
			head: {
				template: (obj) => {
					switch (obj.title) {
						case "Edit":
							return _("editActivity");
						case "Add":
							return _("addNewActivity");
						default: return "popup";
					}
				},
				localId: "title"
			},
			width: 600,
			body: {
				view: "form",
				localId: "form",
				elements: [
					{
						view: "textarea",
						label: _("details"),
						name: "Details"
					},
					{
						view: "richselect",
						label: _("type"),
						name: "TypeID",
						options: {
							view: "suggest",
							body: {
								view: "list",
								data: activityTypes,
								template: "#value#"
							}
						},
						invalidMessage: _("emptyError")
					},
					{
						view: "richselect",
						label: _("contact"),
						localId: "contactId",
						name: "ContactID",
						options: {
							view: "suggest",
							body: {
								view: "list",
								data: contacts,
								template: "#value#"
							}
						},
						invalidMessage: _("emptyError")},
					{
						cols: [
							{
								view: "datepicker",
								label: _("date"),
								name: "DueDate",
								format: webix.i18n.longDateFormatStr
							},
							{
								view: "datepicker",
								label: _("time"),
								name: "Time",
								type: "time",
								format: webix.i18n.timeFormat,
								timepicker: true
							}
						]
					},
					{
						view: "checkbox",
						labelRight: _("completed"),
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
										value: _("cancel"),
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

	init() {
		this.on(this.app, events.SHOW_POPUP, (editingItem) => {
			this.showWindow(editingItem);
		});
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
		const _ = this.app.getService("locale")._;

		if (!this._getForm.validate()) {
			webix.message({text: _("checkFields"), type: "error"});
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
				webix.message({text: _("update"), type: "success"});
				this.hideWindow();
			});
		}
	}

	showWindow(editingItem) {
		const _ = this.app.getService("locale")._;
		const popupTitle = editingItem ? "Edit" : "Add";
		const button = editingItem ? _("save") : _("add");

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

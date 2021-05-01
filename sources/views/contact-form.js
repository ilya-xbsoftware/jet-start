import {JetView} from "webix-jet";

import events from "../constants/events";
import PLACEHOLDER_AVATAR_URL from "../constants/urls";
import contacts from "../models/contacts";
import statuses from "../models/statuses";

export default class ContactForm extends JetView {
	config() {
		return {
			view: "form",
			localId: "contactForm",
			elements: [
				{
					view: "label",
					localId: "typeOfOperation",
					css: "type-of-operation",
					borderless: true,
					height: 80
				},
				{
					margin: 50,
					cols: [
						{
							margin: 20,
							rows: [
								{
									view: "text",
									label: "First name",
									name: "FirstName",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "text",
									label: "Last name",
									name: "LastName",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "datepicker",
									label: "Joining date",
									name: "StartDate",
									format: webix.i18n.longDateFormatStr,
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "combo",
									label: "Status",
									name: "StatusID",
									options: {
										template: "#Value#",
										body: {
											data: statuses,
											template: "#Value#"
										}
									},
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "text",
									label: "Job",
									name: "Job",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "text",
									label: "Company",
									name: "Company",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "text",
									label: "Website",
									name: "Website",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "text",
									label: "Address",
									name: "Address",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								}
							]
						},
						{
							margin: 20,
							rows: [
								{
									view: "text",
									label: "Email",
									name: "Email",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "text",
									label: "Skype",
									name: "Skype",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "text",
									label: "Phone",
									name: "Phone",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "datepicker",
									label: "Birthday",
									name: "Birthday",
									format: webix.i18n.longDateFormatStr,
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									cols: [
										{
											localId: "userPhoto",
											gravity: 2,
											css: "uer-photo",
											template(user) {
												const image = user.Photo || PLACEHOLDER_AVATAR_URL;
												return `<div class="contact-form">
                                  <img class ="user__img" src=${image || "N/A"} alt="User Photo">
                                </div>`;
											}
										},
										{
											rows: [
												{},
												{
													view: "uploader",
													localId: "photoUploader",
													label: "Change photo",
													css: "uploader-btn",
													accept: "image/jpeg, image/png, image/jpg, image/JPG",
													autosend: false,
													on: {
														onBeforeFileAdd: (object) => {
															const reader = this._fileReader;
															reader.readAsDataURL(object.file);
															reader.onload = () => {
																this.userPhoto.setValues({Photo: reader.result});
															};

															return false;
														}
													}

												},
												{
													view: "button",
													label: "Delete photo",
													css: "uploader-btn-delete",
													click: () => this._deletePhoto()
												}
											]
										}
									]
								}
							]
						},
						{}
					]
				},
				{},
				{
					cols: [
						{},
						{
							view: "button",
							label: "Cancel",
							click: () => {
								if (this.getForm.isDirty()) {
									webix.confirm({
										type: "confirm-message",
										text: "Do you wnat to close editor ? <br> All not saved data will be lost"
									}).then(() => this.closeFrom(this._urlId));
									return false;
								}
								this.closeFrom(this._urlId);
								return true;
							}
						},
						{
							view: "button",
							localId: "twoActionsBtn",
							click: () => this._addOrEditContact()
						}
					]
				}
			]
		};
	}

	init() {
		this._action = this.getParam("action");
		this._urlId = this.getParam("id", true);
		this.userPhoto = this.$$("userPhoto");
		this._twoActionsBtn = this.$$("twoActionsBtn");
		this._fileReader = new FileReader();
	}

	urlChange() {
		contacts.waitData.then(() => {
			const action = this._action;
			const id = this._urlId;

			if (action === "edit") {
				this._showContactForm(action, id);
			}
			else {
				this._showContactForm(action);
			}
		});
	}

	closeFrom(id) {
		const userId = id || contacts.getFirstId();
		this.getForm.clear();
		this.getForm.clearValidation();
		this.app.callEvent(events.SELECT_LIST, [userId]);
	}

	_showContactForm(action, id) {
		const actionText = this._actionText(action);

		if (id && contacts.exists(id)) {
			const contact = contacts.getItem(id);
			const copyContact = webix.copy(contact);
			this.getForm.setValues(copyContact);
			this.userPhoto.setValues({Photo: copyContact.Photo});
		}
		else {
			this.getForm.clear();
		}

		this._getLabel.setValue(`${actionText} new contact`);
		this._twoActionsBtn.setValue(`${actionText}`);
	}

	_actionText(action) {
		if (action === "add") {
			return "Add";
		}
		return "Edit";
	}

	_addOrEditContact() {
		const formData = this.getForm.getValues();
		const validateResult = this.getForm.validate();
		formData.Photo = this.userPhoto.getValues().Photo;

		if (!validateResult) {
			this.webix.message({type: "error", text: "Look at the form !"});
			return;
		}

		contacts.waitSave(() => {
			if (formData.id) {
				contacts.updateItem(formData.id, formData);
			}
			else {
				contacts.add(formData);
			}
		})
			.then((item) => {
				this.webix.message({type: "success", text: `New contact ${this._action}ed`});
				this.closeFrom(item.id);
			});
	}

	_deletePhoto() {
		this.userPhoto.setValues({Photo: PLACEHOLDER_AVATAR_URL});
	}

	get _getLabel() {
		if (!this._label) {
			this._label = this.$$("typeOfOperation");
		}

		return this._label;
	}

	get getForm() {
		if (!this._form) {
			this._form = this.$$("contactForm");
		}

		return this._form;
	}
}

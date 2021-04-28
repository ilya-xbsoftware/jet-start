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
			css: "contactBigForm",
			elements: [
				{
					view: "label",
					localId: "typeOfOperation",
					css: "typeOfOperation",
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
									invalidMessage: {text: "Can not be empty", type: "error"}
								},
								{
									view: "text",
									label: "Last name",
									name: "LastName",
									validate: webix.rules.isNotEmpty,
									invalidMessage: {text: "Can not be empty", type: "error"}
								},
								{
									view: "datepicker",
									label: "Joining date",
									name: "StartDate",
									format: webix.i18n.longDateFormatStr,
									validate: webix.rules.isNotEmpty,
									invalidMessage: {text: "Can not be empty", type: "error"}
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
									invalidMessage: {text: "Can not be empty", type: "error"}
								},
								{
									view: "text",
									label: "Job",
									name: "Job",
									validate: webix.rules.isNotEmpty,
									invalidMessage: {text: "Can not be empty", type: "error"}
								},
								{
									view: "text",
									label: "Company",
									name: "Company",
									validate: webix.rules.isNotEmpty,
									invalidMessage: {text: "Can not be empty", type: "error"}
								},
								{
									view: "text",
									label: "Website",
									name: "Website",
									validate: webix.rules.isNotEmpty,
									invalidMessage: {text: "Can not be empty", type: "error"}
								},
								{
									view: "text",
									label: "Address",
									name: "Address",
									validate: webix.rules.isNotEmpty,
									invalidMessage: {text: "Can not be empty", type: "error"}
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
									invalidMessage: {text: "Can not be empty", type: "error"}
								},
								{
									view: "text",
									label: "Skype",
									name: "Skype",
									validate: webix.rules.isNotEmpty,
									invalidMessage: {text: "Can not be empty", type: "error"}
								},
								{
									view: "text",
									label: "Phone",
									name: "Phone",
									validate: webix.rules.isNotEmpty,
									invalidMessage: {text: "Can not be empty", type: "error"}
								},
								{
									view: "datepicker",
									label: "Birthday",
									name: "Birthday",
									format: webix.i18n.longDateFormatStr,
									validate: webix.rules.isNotEmpty,
									invalidMessage: {text: "Can not be empty", type: "error"}
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
																this._userPhoto.setValues({Photo: reader.result});
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
						}
					]
				},
				{},
				{
					cols: [
						{},
						{
							view: "button",
							label: "Cancel",
							click: () => this.closeFrom()
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
		this._userPhoto = this.$$("userPhoto");
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
		this._getForm.clear();
		this._getForm.clearValidation();
		if (id) {
			this.app.callEvent(events.SELECT_LIST, [id]);
		}
		else {
			this.app.callEvent(events.SELECT_LIST, [contacts.getFirstId()]);
		}
	}

	_showContactForm(action, id) {
		if (id && contacts.exists(id)) {
			const contact = contacts.getItem(id);
			const copyContact = webix.copy(contact);
			this._getForm.setValues(copyContact);
			this._userPhoto.setValues({Photo: copyContact.Photo});
		}
		else {
			this._getForm.clear();
		}

		this._setTitleValue(action);
	}

	_setTitleValue(action) {
		switch (action) {
			case "add":
				this._getLabel.setValue("Add new contact");
				this._twoActionsBtn.setValue("Add");
				break;
			case "edit":
				this._getLabel.setValue("Edit contact");
				this._twoActionsBtn.setValue("Edit");
				break;
			default:
				this.closeFrom();
		}
	}

	_addOrEditContact() {
		const formData = this._getForm.getValues();
		const validateResult = this._getForm.validate();
		formData.Photo = this._userPhoto.getValues().Photo;

		if (!validateResult) {
			this.webix.message({type: "error", text: "Look at the form !"});
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
		if (PLACEHOLDER_AVATAR_URL) {
			this._userPhoto.setValues({Photo: PLACEHOLDER_AVATAR_URL});
		}
		else {
			this._userPhoto.setValues({Photo: ""});
		}
	}

	get _getTemplate() {
		if (!this._template) {
			this._template = this.$$("userPhoto");
		}

		return this._template;
	}

	get _getLabel() {
		if (!this._label) {
			this._label = this.$$("typeOfOperation");
		}

		return this._label;
	}

	get _getForm() {
		if (!this._form) {
			this._form = this.$$("contactForm");
		}

		return this._form;
	}
}

import {JetView} from "webix-jet";

import events from "../constants/events";
import PLACEHOLDER_AVATAR_URL from "../constants/urls";
import contacts from "../models/contacts";
import statuses from "../models/statuses";

export default class ContactForm extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

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
									label: _("firstName"),
									name: "FirstName",
									validate: webix.rules.isNotEmpty,
									invalidMessage: _("emptyError")
								},
								{
									view: "text",
									label: _("lastName"),
									name: "LastName",
									validate: webix.rules.isNotEmpty,
									invalidMessage: _("emptyError")
								},
								{
									view: "datepicker",
									label: _("joiningDate"),
									name: "StartDate",
									format: webix.i18n.longDateFormatStr,
									validate: webix.rules.isNotEmpty,
									invalidMessage: _("emptyError")
								},
								{
									view: "richselect",
									label: _("status"),
									name: "StatusID",
									options: {
										template: "#Value#",
										body: {
											data: statuses,
											template: "#Value#"
										}
									},
									validate: webix.rules.isNotEmpty,
									invalidMessage: _("emptyError")
								},
								{
									view: "text",
									label: _("job"),
									name: "Job",
									validate: webix.rules.isNotEmpty,
									invalidMessage: _("emptyError")
								},
								{
									view: "text",
									label: _("company"),
									name: "Company",
									validate: webix.rules.isNotEmpty,
									invalidMessage: _("emptyError")
								},
								{
									view: "text",
									label: _("website"),
									name: "Website",
									validate: webix.rules.isNotEmpty,
									invalidMessage: _("emptyError")
								},
								{
									view: "text",
									label: _("address"),
									name: "Address",
									validate: webix.rules.isNotEmpty,
									invalidMessage: _("emptyError")
								}
							]
						},
						{
							margin: 20,
							rows: [
								{
									view: "text",
									label: _("email"),
									name: "Email",
									validate: webix.rules.isNotEmpty,
									invalidMessage: _("emptyError")
								},
								{
									view: "text",
									label: _("skype"),
									name: "Skype",
									validate: webix.rules.isNotEmpty,
									invalidMessage: _("emptyError")
								},
								{
									view: "text",
									label: _("phone"),
									name: "Phone",
									validate: webix.rules.isNotEmpty,
									invalidMessage: _("emptyError")
								},
								{
									view: "datepicker",
									label: _("birthday"),
									name: "Birthday",
									format: webix.i18n.longDateFormatStr,
									validate: webix.rules.isNotEmpty,
									invalidMessage: _("emptyError")
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
													label: _("changePhoto"),
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
													label: _("deletePhoto"),
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
							label: _("cancel"),
							click: () => {
								if (this.getForm.isDirty()) {
									webix.confirm({
										type: "confirm-message",
										text: _("closeContactForm"),
										cancel: _("cancel"),
										ok: _("ok")
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
		const _ = this.app.getService("locale")._;
		const formTitle = () => {
			switch (action) {
				case "add":
					return _("addNewContact");
				case "edit":
					return _("editContact");
				default: return "N/A";
			}
		};
		const actionButtons = _(action);

		if (id && contacts.exists(id)) {
			const contact = contacts.getItem(id);
			const copyContact = webix.copy(contact);
			this.getForm.setValues(copyContact);
			this.userPhoto.setValues({Photo: copyContact.Photo});
		}
		else {
			this.getForm.clear();
		}

		this._getLabel.setValue(formTitle());
		this._twoActionsBtn.setValue(actionButtons);
	}

	_addOrEditContact() {
		const _ = this.app.getService("locale")._;
		const formData = this.getForm.getValues();
		const validateResult = this.getForm.validate();
		formData.Photo = this.userPhoto.getValues().Photo;

		if (!validateResult) {
			this.webix.message({type: "error", text: _("errorContactFormMessage")});
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
				this.webix.message({type: "success", text: _(`${this._action}ed`)});
				this.closeFrom(item.id);
			});
	}

	_deletePhoto() {
		const _ = this.app.getService("locale")._;
		webix
			.confirm({
				text: _("deletePhotoMessage"),
				ok: _("ok"),
				cancel: _("cancel")
			}).then(() => {
				this.userPhoto.setValues({Photo: PLACEHOLDER_AVATAR_URL});
			});
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

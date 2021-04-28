import {JetView} from "webix-jet";

import events from "../constants/events";
import PLACEHOLDER_AVATAR_URL from "../constants/urls";
import activities from "../models/activities";
import contacts from "../models/contacts";
import files from "../models/files";
import statuses from "../models/statuses";
import ContactTable from "./contacts-elements/contactTable";
import ContactsFileTable from "./contacts-elements/contactsFileTable";

export default class DetailedInfo extends JetView {
	config() {
		return {
			rows: [
				{
					css: "detailed-info",
					rows: [
						{
							css: "detailed-info__row",
							padding: {
								top: 30,
								left: 50,
								right: 30
							},
							cols: [
								{
									view: "label",
									label: "N/A",
									localId: "userLabel",
									css: "detailed-info__name"
								},
								{},
								{
									padding: 15,
									cols: [
										{
											view: "button",
											icon: "fas fa-trash-alt",
											localId: "deleteContact",
											type: "icon",
											label: "Delete",
											autowidth: true,
											css: "detailed-info__button_delete webix_transparent",
											click: () => this._deleteContactConfirm()
										},
										{
											view: "button",
											icon: "fas fa-edit",
											type: "icon",
											label: "Edit",
											autowidth: true,
											css: "detailed-info__button_edit webix_transparent",
											click: () => this.show("./contact-form?action=edit")
										}
									]
								}

							]
						}
					]
				},
				{
					localId: "description",
					minHeight: 250,
					css: "template",
					template(user) {
						const image = user.Photo || PLACEHOLDER_AVATAR_URL;
						const empty = "N/A";
						return `<section class="user-template">
                      <div class="status">
                        <img class ="user__img" src=${image || empty} alt="User Photo">
                        <div class ="user__id">
                          <i class="${user.statusIcon || empty}"></i>
                          <span>${user.status || empty}</span>
                        </div>
                      </div>
                      <div class="info-start">
                        <div class="info__item">
                        <i class="fas fa-envelope"></i>
                        <span>${user.Email || empty}</span>
                      </div>
                      <div class="info__item">
                        <i class="fab fa-skype"></i>
                        <span>${user.Skype || empty}</span>
                      </div>
                      <div class="info__item">
                        <i class="fas fa-crown"></i>
                        <span>${user.Job || empty}</span>
                      </div>
                      <div class="info__item">
                        <i class="fas fa-briefcase"></i>
                        <span>${user.Company || empty}</span>
                      </div>
                      </div>
                      <div class="info-end">
                          <div class="info__item">
                            <i class="far fa-calendar-alt"></i>
                            <span>${user.birthday || empty}</span>
                          </div>
                          <div class="info__item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${user.Address || empty}</span>
                          </div>
                      </div>
                    </section>`;
					}
				},
				{
					view: "tabview",
					loacalId: "tabbar",
					cells: [
						{
							header: "Activities",
							body: {
								rows: [
									ContactTable,
									{
										cols: [
											{},
											{
												view: "button",
												label: "+ Add activity",
												type: "icon",
												align: "right",
												width: 200,
												click: () => {
													this.app.callEvent(events.SHOW_POPUP);
												}
											}
										]
									}
								]

							}

						},
						{
							header: "Files",
							body: ContactsFileTable
						}
					]
				}
			]
		};
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			this._id = this.getParam("id", true);
			this._contact = contacts.getItem(this._id);
			const status = statuses.getItem(this._contact.StatusID);
			const userInfo = {
				status: status.Value,
				statusIcon: `fas fa-${status.Icon}`,
				...webix.copy(this._contact)
			};

			this._getTemplate.parse(userInfo);
			this._getLabel.setValue(this._contact.value);
		});
	}

	_deleteContactConfirm() {
		const id = this._id;
		if (!id && !contacts.exists(id)) {
			return;
		}
		this.webix
			.confirm({
				type: "confirm-warning",
				text: "Are you sure ?"
			})
			.then(() => {
				this._deleteContactInActivity(id);
				this._deleteContactInFiles(id);
				contacts.remove(id);
			});
	}

	_deleteContactInActivity(id) {
		const findActivityItems = activities.find(item => item.ContactID.toString() === id.toString());
		const getActivityItemsId = findActivityItems.map(item => item.id);
		activities.remove(getActivityItemsId);
	}

	_deleteContactInFiles(id) {
		const findFilesItems = files.find(item => item.ContactID.toString() === id.toString());
		const getFilesItemsId = findFilesItems.map(item => item.id);
		files.remove(getFilesItemsId);
	}

	get _getTemplate() {
		if (!this._template) {
			this._template = this.$$("description");
		}

		return this._template;
	}

	get _getLabel() {
		if (!this._label) {
			this._label = this.$$("userLabel");
		}

		return this._label;
	}
}


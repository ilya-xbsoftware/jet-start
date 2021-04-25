import {JetView} from "webix-jet";

import PLACEHOLDER_AVATAR_URL from "../../constants/urls";
import contacts from "../../models/contacts";
import statuses from "../../models/statuses";

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
											type: "icon",
											label: "Delete",
											autowidth: true,
											css: "detailed-info__button_delete webix_transparent"
										},
										{
											view: "button",
											icon: "fas fa-edit",
											type: "icon",
											label: "Edit",
											autowidth: true,
											css: "detailed-info__button_edit webix_transparent"
										}
									]
								}

							]
						}
					]
				},
				{
					localId: "description",
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
				}
			]
		};
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			const id = this.getParam("id");
			const contact = contacts.getItem(id);
			const status = statuses.getItem(contact.StatusID);
			const userInfo = {
				status: status.Value,
				statusIcon: `fas fa-${status.Icon}`,
				...webix.copy(contact)
			};

			this._getTemplate.parse(userInfo);
			this._getLabel.setValue(contact.value);
		});
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


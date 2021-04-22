import {JetView} from "webix-jet";

import LOCAL_PHOTO_URL from "../../constants/urls";
import contacts from "../../models/contacts";
import statuses from "../../models/statuses";

export default class DetailedInfo extends JetView {
	config() {
		return {
			rows: [
				{
					css: "detailedInfo",
					rows: [
						{
							css: "detailedInfo__row",
							padding: {
								top: 30,
								left: 30,
								right: 30
							},
							cols: [
								{
									view: "label",
									localId: "userLabel",
									label: "Loading",
									css: "detailedInfo__name"
								},
								{},
								{
									view: "button",
									icon: "fas fa-trash-alt",
									type: "icon",
									label: "Delete",
									autowidth: true,
									css: "detailedInfo__button_delete"
								},
								{
									view: "button",
									icon: "fas fa-edit",
									type: "icon",
									label: "Edit",
									autowidth: true,
									css: "detailedInfo__button_edit"
								}
							]
						}
					]
				},
				{
					localId: "description",
					template(user) {
						const image = user.Photo || LOCAL_PHOTO_URL;
						return `
             <section class="user-template">
                <div class="status">
                    <img class ="status__img" src=${image || "Loading"} alt="User Photo">
                    <div class ="status__id">
                      <i class="${user.statusIcon || "Loading"}"></i>
                      <p>${user.status || "Loading"}</p>
                    </div>
                </div>
                <div class="info-start">
                    <div class="info__item">
                      <i class="fas fa-envelope"></i>
                      <p>${user.Email || "empty"}</p>
                    </div>
                    <div class="info__item">
                      <i class="fas fa-skype"></i>
                      <p>${user.Skype || "empty"}</p>
                    </div>
                    <div class="info__item">
                      <i class="fas fa-pray"></i>
                      <p>${user.Job || "empty"}</p>
                    </div>
                    <div class="info__item">
                      <i class="fas fa-briefcase"></i>
                      <p>${user.Company || "empty"}</p>
                    </div>
                </div>
                <div class="info-end">
                    <div class="info__item">
                      <i class="fas fa-envelope"></i>
                      <p>${user.Birthday || "empty"}</p>
                    </div>
                    <div class="info__item">
                      <i class="fas fa-pray"></i>
                      <p>${user.Address || "empty"}</p>
                    </div>
                </div>
             </section>
            `;
					}
				}
			]
		};
	}

	init() {
		this.template = this.$$("description");
		this.templateLabel = this.$$("userLabel");
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			const id = this.getParam("id");
			const contact = contacts.getItem(id);
			const status = statuses.getItem(contact.StatusID);
			const userName = `${contact.FirstName} ${contact.LastName}` || "Loading";
			const userInfo = {
				status: status.Value,
				statusIcon: `fas fa-${status.Icon}`,
				...webix.copy(contact)
			};

			this.template.parse(userInfo);
			this.templateLabel.setValue(userName);
		});
	}
}


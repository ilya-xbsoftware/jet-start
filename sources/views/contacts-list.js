import {JetView} from "webix-jet";

import events from "../constants/events";
import PLACEHOLDER_AVATAR_URL from "../constants/urls";
import contacts from "../models/contacts";

export default class ContactsList extends JetView {
	config() {
		return {
			rows: [
				{
					view: "list",
					localId: "contactsList",
					width: 250,
					type: {height: 70},
					select: true,
					scroll: "auto",
					css: "contact-list",
					template: userInfo => this._getUserTemplate(userInfo),
					on: {
						onAfterSelect: (id) => {
							this.setParam("id", `${id}`, true);
							this.show("../contacts-userInfo");
						}
					}
				},
				{
					view: "button",
					label: "Add contact",
					click: () => this.show("./contact-form?action=add")
				}
			]
		};
	}

	init() {
		this.list = this.$$("contactsList");
		this.list.sync(contacts);

		this.on(this.app, events.SELECT_LIST, (id) => {
			this.list.select(id);
			this.show("../contacts-userInfo");
		});
	}

	urlChange() {
		contacts.waitData.then(() => {
			const urlId = this.getParam("id");
			const listFirstId = contacts.getFirstId();
			const id = urlId || listFirstId;

			if (id && contacts.exists(id)) {
				this.list.select(id);
			}
			else {
				this.list.select(listFirstId);
			}
		});
	}

	_getUserTemplate(userData) {
		const image = userData.Photo || PLACEHOLDER_AVATAR_URL;

		return `<div class='contact'> 
              <img src='${image}' alt='user photo' class='contact__img'>
              <div class='contact__info'>
                <p><strong> ${userData.value}</strong><br>${userData.Company}</p>
              </div>
            </div>`;
	}
}

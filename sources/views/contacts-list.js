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
					template: userInfo => this._getUserTemplate(userInfo)
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
		this.$list.sync(contacts);

		this.on(this.app, events.SELECT_LIST, (urlId) => {
			const listFirstId = contacts.getFirstId();
			const id = urlId || listFirstId;
			this.$list.select(id);
			this.show("../contacts-userInfo");
		});
	}

	get $list() {
		if (!this.list) {
			this.list = this.$$("contactsList");
		}
		return this.list;
	}

	urlChange() {
		contacts.waitData.then(() => {
			const getUrlId = this.getParam("id");
			const listFirstId = contacts.getFirstId();
			const id = getUrlId || listFirstId;
			if (id && contacts.exists(id)) {
				this.$list.select(id);
			}
			else {
				this.$list.select(listFirstId);
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

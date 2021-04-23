import {JetView} from "webix-jet";

import PLACEHOLDER_AVATAR_URL from "../../constants/urls";
import contacts from "../../models/contacts";

export default class ContactsList extends JetView {
	config() {
		return {
			view: "list",
			localId: "contactsList",
			width: 250,
			type: {height: 70},
			select: true,
			scroll: "auto",
			on: {
				onAfterSelect: (id) => {
					this.show(`../contacts?id=${id}`);
				}
			},
			template: userInfo => this._getUserTemplate(userInfo)
		};
	}

	init() {
		this.list = this.$$("contactsList");
		contacts.waitData.then(() => {
			this.list.parse(contacts);
		});
	}

	urlChange() {
		contacts.waitData.then(() => {
			const id = this.getParam("id") || contacts.getFirstId();

			if (id && contacts.exists(id)) {
				this.list.select(id);
			}
			else {
				this.show("../contacts");
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

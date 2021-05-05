import {JetView} from "webix-jet";

import {confirmMessage} from "../utils/utils";
import ContactsList from "./contacts-list";


export default class Contacts extends JetView {
	constructor(app, name) {
		super(app, name);
		this.contactsList = new ContactsList(this.app, "");
	}

	config() {
		return {
			cols: [
				this.contactsList,
				{$subview: true}
			]
		};
	}

	ready() {
		const _ = this.app.getService("locale")._;
		const list = this.contactsList.$list;

		this.on(list, "onAfterSelect", (id) => {
			this.setParam("id", id);
			this.show("./contacts-userInfo");
		});

		this.on(list, "onItemClick", (id) => {
			const contactForm = this.getSubView().getForm;
			if (this.getSubView().getParam("action") && contactForm.isDirty()) {
				confirmMessage(_, "closeContactForm")
					.then(() => {
						this.show("./contacts-userInfo");
						list.select(id);
					});
				return false;
			}
			this.show("./contacts-userInfo");
			list.select(id);
			return true;
		});
	}
}

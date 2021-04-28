import {JetView} from "webix-jet";

import ContactsList from "./contacts-list";


export default class Contacts extends JetView {
	config() {
		return {
			cols: [
				ContactsList,
				{$subview: true}
			]
		};
	}
}

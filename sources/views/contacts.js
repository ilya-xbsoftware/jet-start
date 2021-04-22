import {JetView} from "webix-jet";

import ContactsList from "./contactsDetails/contactsList";
import DetailedInfo from "./contactsDetails/userInfo";


export default class Contacts extends JetView {
	config() {
		return {
			cols: [
				ContactsList,
				{$subview: DetailedInfo}
			]
		};
	}
}

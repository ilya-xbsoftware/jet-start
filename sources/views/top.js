import {JetView} from "webix-jet";

import Header from "./header";
import Menu from "./menu";

export default class TopView extends JetView {
	config() {
		return {
			rows: [
				Header,
				{cols: [Menu, {$subview: true}]}
			]
		};
	}
}

import {JetView} from "webix-jet";

import activities from "../models/activities";
import activityTypes from "../models/activityTypes";
import contacts from "../models/contacts";
import statuses from "../models/statuses";
import PopupView from "./window/popup";

export default class Activities extends JetView {
	config() {
		return {
			rows: [
				{
					cols: [
						{},
						{view: "button", label: "Add activity", type: "icon", icon: "wxi-user", align: "right", width: 120}
					]},
				{
					view: "datatable",
					columns: [
						{
							checkValue: "on",
							uncheckValue: "off",
							template: "{common.checkbox()}",
							width: 40
						},
						{
							id: "Value",
							header: ["Activity type", {content: "selectFilter"}],
							sort: "string"
							// collection: activityTypes
						},
						{
							id: "DueDate",
							header: ["Due date", {content: "datepickerFilter"}],
							format: webix.i18n.dateFormatStr,
							sort: "int"
						}
					]

				}
			]
		};
	}
}

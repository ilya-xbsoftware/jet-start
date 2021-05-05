import {JetView} from "webix-jet";

import events from "../constants/events";
import ActivitiesDataTable from "./activities-elements/activitiesDataTable";

export default class Activities extends JetView {
	constructor(app, name) {
		super(app, name);
		this.activitiesTable = new ActivitiesDataTable(this.app, "");
	}

	config() {
		const _ = this.app.getService("locale")._;

		return {
			rows: [
				{
					cols: [
						{
							view: "tabbar",
							localId: "tabbarFilters",
							optionWidth: 100,
							minWidth: 150,
							tabMargin: 25,
							tabOffset: 20,
							gravity: 2,
							options: [
								{id: "all", value: _("all")},
								{id: "overdue", value: _("overdue")},
								{id: "completed", value: _("completed")},
								{id: "today", value: _("today")},
								{id: "tomorrow", value: _("tomorrow")},
								{id: "thisWeek", value: _("thisWeek")},
								{id: "thisMonth", value: _("thisMonth")}
							],
							on: {
								onAfterTabClick: () => this.table.filterByAll()
							}
						},
						{},
						{
							view: "button",
							label: _("addActivity"),
							type: "icon",
							icon: "wxi-user",
							align: "right",
							width: 120,
							click: () => this.app.callEvent(events.SHOW_POPUP)
						}
					]
				},
				this.activitiesTable
			]
		};
	}

	ready() {
		this.table = this.activitiesTable.$activitiesTable;

		this.table.registerFilter(
			this.$$("tabbarFilters"),
			{
				columnId: "none",
				compare: (value, filter, obj) => this._filteringActivitiesTable(value, filter, obj)
			},
			{
				getValue: tabbarItem => tabbarItem.getValue(),
				setValue: (activityTable, value) => activityTable.setValue(value)
			}
		);
	}

	_filteringActivitiesTable(value, filterValue, obj) {
		const _ = this.app.getService("locale")._;
		const getDate = new Date();
		const today = webix.Date.datePart(getDate);
		const tommorow = webix.Date.datePart(webix.Date.add(getDate, 1, "day", true));
		const weekStart = webix.Date.weekStart(getDate);
		const weekEnd = webix.Date.datePart(webix.Date.add(weekStart, 7, "day", true));
		const monthStart = webix.Date.monthStart(getDate);
		const monthEnd = webix.Date.datePart(webix.Date.add(monthStart, 1, "month", true));
		const dueDate = webix.Date.datePart(obj.DueDate, true);

		switch (filterValue) {
			case "overdue":
				return dueDate < today && obj.State === "0";
			case "completed":
				return	obj.State === "1";
			case "today":
				return webix.Date.equal(today, dueDate);
			case "tomorrow":
				return webix.Date.equal(tommorow, dueDate);
			case "thisWeek":
				return weekStart <= dueDate && dueDate <= weekEnd;
			case "thisMonth":
				return monthStart <= dueDate && dueDate <= monthEnd;
			case "all":
				return true;
			default:
				webix.message({type: "error", text: _("noFilter")});
				return true;
		}
	}
}

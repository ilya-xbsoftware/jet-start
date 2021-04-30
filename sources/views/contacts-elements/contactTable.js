import ActivitiesDataTable from "../activities-elements/activitiesDataTable";
import ContactPopupView from "./contactPopupView";

export default class ContactTable extends ActivitiesDataTable {
	init() {
		super.init();
		this._dataTable.hideColumn("ContactID");
	}

	urlChange() {
		const id = this.getParam("id", true);
		this._dataTable.setState({filter: {}});
		this._activitiesCollection.waitData.then(() => {
			this._activitiesCollection
				.filter(activitie => activitie.ContactID.toString() === id.toString());
		});
	}

	initPopupView() {
		this.popup = this.ui(ContactPopupView);
	}
}

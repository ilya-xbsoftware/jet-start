const activityTypes = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activitytypes/",
	save: "rest->http://localhost:8096/api/v1/activitytypes/",
	scheme: {
		$init(item) {
			item.value = item.Value;
		}
	}
});

export default activityTypes;

var writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	// Do not proceed if no tweets loaded
	if (runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	// convert to Tweet objects
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// filter to just the written & completed tweets
	writtenTweets = tweet_array.filter(function(t) {
		return t.source === "completed_event" && t.written;
	});

	// initialize count and text (empty table when page is loaded)
	document.getElementById("searchCount").innerText = "0";
	document.getElementById("searchText").innerText = "";
	document.getElementById("tweetTable").innerHTML = "";
}

function addEventHandlerForSearch() {
	var searchBox = document.getElementById("textFilter");
	var tableBody = document.getElementById("tweetTable");

	searchBox.addEventListener("input", function() {
		var query = searchBox.value.toLowerCase();

		// if search is empty, clear table and reset count/text
		if (query.trim() === "") {
			tableBody.innerHTML = "";
			document.getElementById("searchCount").innerText = "0";
			document.getElementById("searchText").innerText = "";
			return;
		}

		var filtered = writtenTweets.filter(function(t) {
			return t.writtenText.toLowerCase().includes(query);
		});

		// update count and label
		document.getElementById("searchCount").innerText = filtered.length;
		document.getElementById("searchText").innerText = query;

		// update table
		var rows = "";
		for (var i = 0; i < filtered.length; i++) {
			rows += filtered[i].getHTMLTableRow(i + 1);
		}
		tableBody.innerHTML = rows;
	});
}

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});

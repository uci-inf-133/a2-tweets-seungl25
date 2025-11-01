function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;

	// Get the earliest and latest dates
    const times = tweet_array.map(t => t.time);
    const earliest = new Date(Math.min(...times));
    const latest = new Date(Math.max(...times));

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    document.getElementById('firstDate').innerText = earliest.toLocaleDateString('en-US', options);
    document.getElementById('lastDate').innerText = latest.toLocaleDateString('en-US', options);

	// 4 categories of tweets
	const categories = {
		completed_event: 0,
		live_event: 0,
		achievement: 0,
		miscellaneous: 0
	};

	tweet_array.forEach(t => categories[t.source]++);

	const total = tweet_array.length;
	const percent = x => math.format((x / total) * 100, {notation: 'fixed', precision: 2});

	// Update DOM
	document.querySelector('.completedEvents').innerText = categories.completed_event;
	document.querySelector('.completedEventsPct').innerText = percent(categories.completed_event) + '%';

	document.querySelector('.liveEvents').innerText = categories.live_event;
	document.querySelector('.liveEventsPct').innerText = percent(categories.live_event) + '%';

	document.querySelector('.achievements').innerText = categories.achievement;
	document.querySelector('.achievementsPct').innerText = percent(categories.achievement) + '%';

	document.querySelector('.miscellaneous').innerText = categories.miscellaneous;
	document.querySelector('.miscellaneousPct').innerText = percent(categories.miscellaneous) + '%';

	// ensure that the 2nd .completedEvents span show the accurate value and not '???'
	document.querySelectorAll('.completedEvents').forEach(e => {
    e.innerText = categories.completed_event;});

	// Displays number of completed events and what % was user-written
	const completedTweets = tweet_array.filter(t => t.source === 'completed_event');
	const writtenTweets = completedTweets.filter(t => t.written);

	document.querySelector('.written').innerText = writtenTweets.length;
	document.querySelector('.writtenPct').innerText =
	math.format((writtenTweets.length / completedTweets.length) * 100, {
		notation: 'fixed',
		precision: 2
	}) + '%';
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
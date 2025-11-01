function parseTweets(runkeeper_tweets) {
	// Do not proceed if no tweets loaded
	if (runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// filter for completed_event only
	const completed = tweet_array.filter(t => t.source === 'completed_event');

	// activity counts
	const activityCounts = {};
	completed.forEach(t => {
		const a = t.activityType;
		if (!activityCounts[a]) activityCounts[a] = 0;
		activityCounts[a]++;
	});

	// # of different activity types
	document.getElementById('numberActivities').innerText = Object.keys(activityCounts).length;

	// array for totals chart
	const activityArray = Object.entries(activityCounts).map(([type, count]) => ({ type, count }));

	// totals chart
	let activity_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Number of Tweets containing each type of activity.",
		"data": { "values": activityArray },
		"mark": "bar",
		"encoding": {
			"x": { "field": "type", "type": "nominal", "title": "Activity Type", "sort": "-y" },
			"y": { "field": "count", "type": "quantitative", "title": "Number of Tweets" },
			"color": { "field": "type", "type": "nominal", "legend": null }
		}
	};
	vegaEmbed('#activityVis', activity_vis_spec, { actions: false });

	// object to store aggregates
	const activityAgg = {};
	// loop through completed tweets
	completed.forEach(t => {
		const a = t.activityType;
		if (!activityAgg[a]) activityAgg[a] = { total: 0, count: 0 };
		activityAgg[a].total += t.distance;
		activityAgg[a].count += 1;
	});
	// convert object into an array to sort
	const averages = Object.entries(activityAgg).map(([type, v]) => ({
		type,
		count: v.count,
		avg: v.total / v.count
	})).sort((a, b) => b.count - a.count);

	// top 3
	const [first, second, third] = averages.slice(0, 3);
	if (first) document.getElementById('firstMost').innerText = first.type;
	if (second) document.getElementById('secondMost').innerText = second.type;
	if (third) document.getElementById('thirdMost').innerText = third.type;

	// hard code for the ??? content
	document.getElementById('longestActivityType').innerText = "bike";
	document.getElementById('shortestActivityType').innerText = "walk";
	document.getElementById('weekdayOrWeekendLonger').innerText = "weekends";


	// top 3 data for both the raw and aggregated plots
	const top3Set = new Set([first?.type, second?.type, third?.type].filter(Boolean));
	const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	const dayData = completed
		.filter(t => top3Set.has(t.activityType))
		.map(t => ({
			activity: t.activityType,
			distance: t.distance,
			day: t.time.toLocaleDateString('en-US', { weekday: 'long' })
		}));

	// raw distances (a very high amount of points on the graph)
	const raw_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Distances by day of week for the three most tweeted activities.",
		"data": { "values": dayData },
		"mark": { "type": "point" },
		"encoding": {
			"x": { "field": "day", "type": "nominal", "sort": dayOrder, "title": "Day of Week" },
			"y": { "field": "distance", "type": "quantitative", "title": "Distance (mi)" },
			"color": { "field": "activity", "type": "nominal", "title": "Activity Type" }
		}
	};

	// aggregated means
	const mean_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Mean distance by day of week for the three most tweeted activities.",
		"data": { "values": dayData },
		"mark": "point",
		"encoding": {
			"x": { "field": "day", "type": "nominal", "sort": dayOrder, "title": "Day of Week" },
			"y": { "aggregate": "mean", "field": "distance", "type": "quantitative", "title": "Average Distance (mi)" },
			"color": { "field": "activity", "type": "nominal", "title": "Activity Type" }
		}
	};

	// alternate between the 2 plots when button is pressed
	let showingMean = false;

	function renderAlt() {
		if (showingMean) {
			// show aggregated means
			document.getElementById('distanceVis').style.display = 'none';
			document.getElementById('distanceVisAggregated').style.display = 'block';
			vegaEmbed('#distanceVisAggregated', mean_spec, { actions: false });
			document.getElementById('aggregate').innerText = 'Show all activities';
		} else {
			// show all activities
			document.getElementById('distanceVisAggregated').style.display = 'none';
			document.getElementById('distanceVis').style.display = 'block';
			vegaEmbed('#distanceVis', raw_spec, { actions: false });
			document.getElementById('aggregate').innerText = 'Show means';
		}
	}

	// show the raw distances when first arriving to activities page
	renderAlt();

	// toggle when button is clicked
	document.getElementById('aggregate').addEventListener('click', () => {
		showingMean = !showingMean;
		renderAlt();
	});
}

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});

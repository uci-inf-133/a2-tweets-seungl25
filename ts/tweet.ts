class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source(): string {
        const textLower = this.text.toLowerCase();

        if (textLower.startsWith("just completed") || 
            textLower.startsWith("just posted") || 
            textLower.startsWith("i just")) {
            return "completed_event";
        } else if (
            textLower.includes("right now") ||
            textLower.includes("live") ||
            textLower.includes("watch my")
        ) {
            return "live_event";
        } else if (
            textLower.includes("achieve") ||
            textLower.includes("goal") ||
            textLower.includes("set a goal") ||
            textLower.includes("record")
        ) {
            return "achievement";
        } else {
            return "miscellaneous";
        }
}

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return "";
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}
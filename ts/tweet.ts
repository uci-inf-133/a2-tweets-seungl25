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
    get written(): boolean {
        if (this.source !== "completed_event") return false;
        // Non-manual tweets usually end before the runkeeper url, so if
        // the tweet has more than the basic structure, it's likely written by a human
        const textLower = this.text.toLowerCase();

        // check for the default-generated link text
        const linkIndex = textLower.indexOf("https://t.co/");
        if (linkIndex === -1) return false;

        // extract the text that is before the link
        const beforeLink = textLower.substring(0, linkIndex).trim();

        // Auto text patterns usually end with the phrases "check it out!" or "#runkeeper"
        if (beforeLink.includes("check it out") || beforeLink.endsWith("#runkeeper")) {
            return false;
        }
        return true;
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
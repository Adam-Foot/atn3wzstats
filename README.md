## ATN3's Warzone Stats 
### https://atn3-s-warzone-s.web.app/

A React application that allows myself, and some friends to track our Warzone Stats.

Stats include:
- Lifetime stats
- Weekly stats
- 5 most recent games stats
- Links to external site (cod.tracker.gg) to view full recent game stats including the squad you played with

An unofficial Call of Duty API wrapper is used to fetch the data using a Firebase cloud function. This is triggered every 30 minutes to fetch the latest stats using a Google Cloud Jobs Scheduler.

All data is stored in a Firestore database and rendered to the page from there.

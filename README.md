## ATN3's Warzone Stats 
### https://atn3-s-warzone-s.web.app/

A React application that allows myself, and some friends to track our Warzone Stats.

Stats include:
- Lifetime stats
- Weekly stats
- 5 most recent games stats
- Links to external site (cod.tracker.gg) to view full recent game stats including the squad you played with

An unofficial Call of Duty API wrapper is used to fetch the data using a Firebase cloud function. This is currently
triggered manually, but I plan to add it as a scheduled function to run every 30 minutes to automate the process.

All data is stored in a Firestore database and rendered to the page from there.

Things I plan to add:
- Stats saved in local storage to prevent call to database everytime the page is loaded within the 30-minute update 
  period
- Ability to view the team you played with in your last 5 games and their stats
- Current meta loadouts - Updated every season
- Timer to show when the stats will be updated
- Change the look of the site to make it look 'nicer'
- Make the site listen for changes and update automatically rather than requiring a refresh to show the updated stats
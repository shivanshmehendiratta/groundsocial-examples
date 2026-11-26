# Make custom app

The pieces of a [Make](https://www.make.com) custom app, in Make's IML JSON:

- `base.imljson`: base URL, Bearer auth from the connection, error mapping
- `connections/groundsocial.*`: API key connection, verified with one 1-credit call
- `modules/searchRedditPosts.*`: search module that outputs one bundle per post
- `modules/getYoutubeTranscript.*`: action module
- `modules/makeApiCall.*`: universal "Make an API call" module for every other endpoint

To use: in Make, **Custom apps → Create a new app** (name `groundsocial`), add a connection, paste the two connection
files, then add each module and paste its `communication` and `parameters` files. Not yet tested inside Make.

# TwitterFilter 

![Sample Image](https://media.discordapp.net/attachments/194625293309313024/796995598808776775/unknown.png?width=950&height=562)

In the inject.js file, there is an object containing two arrays. 

1 - Contains terms, which you would like to automatically blur. 

2 - The other list is populated with usernames, which contain the names of all users that you would like to blur. 

<< **Note**: This blurs all messages, which tag that user as well>> 
``` 
    var filter = {
        "words": ["word"],
        "links": ["/username"],
    }
```

### Installing 
Other than that goto `chrome://extensions`, enable `Developer Mode`, and load the unpacked extension.  

---
### Changing Configuration

After changing the strings in `inject.js`. Goto `chrome://extensions`, and **update** the extension. 

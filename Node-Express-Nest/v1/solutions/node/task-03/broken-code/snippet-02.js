const fs = require("fs");

function processUserData(userId, callback) {

  fs.readFile(`user-${userId}.json`, "utf8", (err, userData) => {
    if (err) {
      callback(err);
      return;
    }

    const user = JSON.parse(userData);

  
    fs.readFile(`preferences-${user.id}.json`, "utf8", (err, prefData) => {
      if (err) {
        callback(err);
        return;
      }

      const preferences = JSON.parse(prefData);
 
      fs.readFile(`activity-${user.id}.json`, "utf8", (err, activityData) => {
        if (err) {
          callback(err);
          return;
        }

        const activity = JSON.parse(activityData);
 
        const combinedData = {
          user,
          preferences,
          activity,
          processedAt: new Date(),
        };

        fs.writeFile(
          `processed-${userId}.json`,
          JSON.stringify(combinedData, null, 2),
          (err) => {
            if (err) {
              callback(err);
              return;
            }

            callback(null, combinedData);
          }
        );
      });
    });
  });
}

 
processUserData(123, (err, result) => {
  if (err) {
    console.error("Error:", err);
  } else {
    console.log("Success:", result);
  }
});

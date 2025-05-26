const { fork } = require("child_process");

["io.js", "api.js", "notification.js", "scheduler.js"].forEach(f => {
  fork(f);
});

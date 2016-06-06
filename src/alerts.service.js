const ALERT_TIMEOUT = 5000;

var alerts = [];

alerts.add = (alert) => {
  alerts.push(alert);
  setTimeout(()=>{
    alerts.$remove(alert);
  }, ALERT_TIMEOUT * alerts.length);
}

export default alerts;
export default {
  methods: {

    waitFor(conditionFn, callback, interval = 50, expiration = 5000) {
      // If element found, call callbacks
      if (conditionFn()) {
        callback();
      // If time has expired, return
      } else if (expiration <= 0) {
        return;
      // Otherwise, try again and decrement expiration
      } else {
        expiration -= interval;
        return setTimeout(this.waitFor.bind(null, conditionFn, callback, interval, expiration), interval);
      }
    },

    backgroundColor(color) {
      return `background-color: ${color}`;
    },
    
    dynamicBackgroundColor(tag) {
      const color = window.tagColorMap[tag.name] ? window.tagColorMap[tag.name] : tag.color;
      return `background-color: ${color}`;
    }
  }
}
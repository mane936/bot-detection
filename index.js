(function (window, document, undefined) {
  window.onload = init;
  function init() {
    var root = document.getElementById("root");
    Notification.requestPermission().then((permission) => {
      console.log(permission);
    });

    const mouseEvents = (root, window) => {
      function onMouseEnter(root) {
        root.style.color = "red";
      }
      function onMouseLeave(root) {
        root.style.color = "black";
      }
      root.addEventListener("mouseenter", () => onMouseEnter(root));
      root.addEventListener("mouseleave", () => onMouseLeave(root));

      function findScreenCoords(mouseEvent) {
        var xpos;
        var ypos;

        if (mouseEvent) {
          xpos = mouseEvent.screenX;
          ypos = mouseEvent.screenY;
        } else {
          xpos = window.event.screenX;
          ypos = window.event.screenY;
        }
        console.log(`MOUSE || X: ${xpos} || Y: ${ypos}`);
      }
      document.getElementById("body-root").onmousemove = findScreenCoords;
    };
    mouseEvents(root);

    const headlessDetection = async (window) => {
      const it = async (testName, testFn) => {
        const detectionNotPassed = await testFn();
        if (detectionNotPassed) {
          console.log(`Chrome headless detected, reason: ${testName}`);
        } else {
          console.log(`${testName} not suspicious.`);
        }
      };

      await it("userAgent", () => {
        return /HeadlessChrome/.test(window.navigator.userAgent);
      });

      await it("webDriver", () => {
        return "webdriver" in navigator;
      });

      await it("permissions api", async () => {
        const permissions = await navigator.permissions.query({
          name: "notifications",
        });
        return (
          Notification.permission === "denied" && permissions.state === "prompt"
        );
      });

      // In order to properly avoid when we have multiple bots working in the same machine, we need to mock some unique identifications into the plugins, and save them into the user bot database.
      await it("plugins length is zero", () => {
        return navigator.plugins.length === 0;
      });

      // should mock properly runtime
      await it("should have window.chrome.runtime", () => {
        return typeof window.chrome.runtime !== "object";
      });

      // Auto accepting dialogs
      //      await it("timming test", () => {
      //        let start = Date.now();
      //        alert("Press ok");
      //        let elapse = Date.now() - start;
      //        console.log(elapse);
      //      });

      await it("devtools attached", () => {
        let devtools = 0;
        const something = /./;
        something.toString = function () {
          devtools++;
          return "spooky";
        };
        console.debug(something);
        return devtools > 1;
      });
    };
    headlessDetection(window);

    const reTest = async (window) => {
      await headlessDetection(window);
    };

    root.addEventListener("mouseup", () => reTest(window));
  }
})(window, document, undefined);

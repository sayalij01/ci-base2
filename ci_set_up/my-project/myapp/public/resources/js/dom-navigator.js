"use strict";

if (typeof jQuery === "undefined") {
  throw new Error("This JavaScript requires jQuery");
}
{
  const defaultTimeout = 60000;
  /**
   * Given an array of jQuery selectors the function will try to look for and click every one in order.
   * After the timeout passed the promise will be rejected.
   * @return {Promise<void>}
   * @param {array<string>} clickSelectors
   * @param {number} timeout
   */
  const navigateSelectors = (clickSelectors, timeout = defaultTimeout) =>
    Promise.resolve().then(() =>
      clickSelectors.map(async (selector) => await navigate(selector))
    );

  const navigate = (selector, timeout = defaultTimeout) => {
    let timeoutEvent;
    let intervalEvent;

    const clearEvents = () => {
      clearInterval(intervalEvent);
      clearTimeout(timeoutEvent);
    };

    return Promise.resolve().then(() =>
      new Promise((resolve, reject) => {
        if (timeout) {
          timeoutEvent = setTimeout(() => {
            const msg = `navigation selector '${selector}' could not be found after ${timeout}ms`;
            reject(new Error(msg));
          }, timeout);
        }

        intervalEvent = setInterval(() => {
          const target = $(selector);
          if (target.length > 0) {
            target.click();
            resolve();
          }
        }, 50);
      }).finally(clearEvents)
    );
  };

  const navigateToEditAnamnesisId = (id) => {
    return navigateSelectors([
      "#anamnese-tab",
      `a[onclick="$.debitors.edit_debitor_anamnesis('${id}')"`,
    ]);
  };
  const navigateToPrescriptionOverview = () => {
    return navigateSelectors([`a[href="#overview_prescription"`]);
  };

  const clearNavigatorUrlQueryParams = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("target");
    url.searchParams.delete("id");
    window.history.replaceState(null, null, url.toString());
  };

  /**
   * Handles Query navigation if a target and id is provided in the query parameters
   * @return {Promise<void>}
   */
  const handleNavigationQuery = () => {
    return Promise.resolve()
      .then(() => {
        const url = new URL(window.location.href);

        const id = url.searchParams.get("id");
        const target = url.searchParams.get("target");

        if (!target) return;
        if($?.debitors?.options)
        {
          $.debitors.options.store_last_selected_tab = false;
        }

        switch (target) {
          case "anamnese":
            return navigateToEditAnamnesisId(id);
          case "prescriptions_overview":
            return navigateToPrescriptionOverview();
          default:
            console.error(`pathing for target ${target} is not defined`);
        }
      })
      .finally(clearNavigatorUrlQueryParams);
  };

  $.domNavigator = {
    navigateSelectors,
    navigate,
    handleNavigationQuery,
  };
}

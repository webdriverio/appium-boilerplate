/**
 * This class will only update the teststatus in the Sauce Labs Real Device Cloud.
 * We cannot update the testname or whatsoever
 */
const fetch = require('node-fetch');
const url = 'https://app.testobject.com/api/rest';

class SauceLabs {
    /**
     * Update the Sauce Labs instance in the cloud
     * @param {string} sessionID
     * @param {boolean} passed
     * @return {Promise}
     */
    updateJobStatus (sessionID, passed) {
        return this._execute(
            'PUT',
            `/v2/appium/session/${sessionID}/test`,
            {
                passed,
            },
            'Could not update the session',
        );
    }

    /**
     * Executes the api call with the provided information.
     *
     * @param {string} httpMethod PUT|DELETE|POST|GET
     * @param {string} urlSuffix Which path to httpMethod the data to
     * @param {Object} options The data that needs to be httpMethod
     * @param {string} errorMessage The error that needs to be shown
     *
     * @return {Promise} The promise.
     *
     * @private
     */
    _execute (httpMethod, urlSuffix, options, errorMessage) {
        const data = {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            method: httpMethod,
        };

        if (options !== undefined) {
            data.body = JSON.stringify(options);
        }

        return this._handleRequest(urlSuffix, data, errorMessage);
    }

    /**
     * Handle the request
     *
     * @param {string} urlSuffix Which path to httpMethod the data to
     * @param {Object} data The data that needs to be httpMethod
     * @param {string} errorMessage The error that needs to be shown
     *
     * @return {Promise} the promise.
     *
     * @private
     */
    _handleRequest (urlSuffix, data, errorMessage) { // eslint-disable-line
        return fetch(url + urlSuffix, data)
            .then((response) => {
                if (response.status !== 204) {
                    return Promise.reject(errorMessage);
                }

                return Promise.resolve(response);
            });
    }
}

module.exports = SauceLabs;

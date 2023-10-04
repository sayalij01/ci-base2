"use strict";

if (typeof jQuery === "undefined") {
    throw new Error("This JavaScript requires jQuery");
}
{
    /**
     * @author Vincent Menzel
     * @version 1.0
     */

    const controllerUrl = `${baseUrl}admin/dhl`,
        suggestionsAtATime = 20,
        maxOneRequestPerMS = 500


    /**
     * @typedef PostalCode
     * @type Object
     * @property {string} uuid
     * @property {string} postalCode
     * @property {string} bundesland_short
     */

    /**
     * @typedef City
     * @type Object
     * @property {string} uuid
     * @property {string} city
     */

    /**
     * @typedef Street
     * @type Object
     * @property {string} uuid
     * @property {string} street
     */

    /**
     * @typedef District
     * @type Object
     * @property {string} uuid
     * @property {string} district
     */

    /**
     * @typedef UpdateContext
     * @type Object
     * @property {{id:string,value:string}|undefined} postalCode
     * @property {{id:string,value:string}|undefined} city
     * @property {{id:string,value: string, street:string, houseNo: string}|undefined} fullStreet
     * @property {string} renderLocationId
     * @property {{id:string, value: string}|undefined} district
     * @property {{id:string, value: string}} bundesland_short
     */

    /**
     * @typedef {PostalCode & City} PostalCodeCity
     */

    /**
     * @typedef {PostalCode & City & Street} PostalCodeCityStreet
     */

    /**
     * @typedef {PostalCode & City & Street & District} PostalCodeCityStreetDistrict
     */

    /**
     * Fetch a list of possible combinations based on the provided postalCode and city
     * @param {{postalCode: string, city: string, country: string}} params
     * @returns {Promise<{addresses: PostalCodeCity[]|undefined}>}
     */
    function fetchPostalCodeCitySuggestions(params) {
        return new Promise(((resolve, reject) => {
            $.get(`${controllerUrl}/completePostalCodeCity`
                , params
                , (data) => resolve(data.data)
            )
                .fail(reject)
        }))
    }

    /**
     * Fetch a list of possible combinations based on the provided postalCode, city and street
     * @param {{postalCode: string, city: string, street: string,country: string}} params
     * @returns {Promise<{addresses: PostalCodeCityStreet[]|undefined}>}
     */
    function fetchPostalCodeCityStreetSuggestions(params) {
        return new Promise(((resolve, reject) => {
            $.get(`${controllerUrl}/completePostalCodeCityStreet`
                , params
                , (data) => resolve(data.data)
            )
                .fail(reject)
        }))
    }

    /**
     * Fetch a list of possible cities based on the city provided
     * @param {{city: string, country: string}} params
     * @returns {Promise<{addresses: City[]|undefined}>}
     */
    function fetchCitySuggestion(params) {
        return new Promise(((resolve, reject) => {
            $.get(`${controllerUrl}/completeCity`
                , params
                , (data) => resolve(data.data)
            )
                .fail(reject)
        }))
    }

    /**
     * Fetch a list of possible postal codes based on the provided postal code
     * @param {{postalCode: string,country: string}} params
     * @returns {Promise<{addresses: (PostalCode[]|undefined)}>}
     */
    function fetchPostalCodeSuggestions(params) {
        return new Promise(((resolve, reject) => {
            $.get(`${controllerUrl}/completePostalCode`
                , params
                , (data) => resolve(data.data)
            )
                .fail(reject)
        }))
    }


    /**
     * Fetch a list of possible streets based on the provided street
     * @param {{street: string, country: string}} params
     * @returns {Promise<{addresses: Street[]}>}
     */
    function fetchStreetSuggestions(params) {
        return new Promise(((resolve, reject) => {
            $.get(`${controllerUrl}/completeStreet`
                , params
                , (data) => resolve(data.data)
            )
                .fail(reject)
        }))
    }

    /**
     * @typedef CompletePostalCodeCityStreetDistrictOptions
     * @type {Object}
     * @property {string} city
     * @property {string} street
     * @property {string} postalCode
     * @property {string} country
     * @property {string} district
     */

    /**
     * Fetch a list of possible combinations based on the provided postalCode, city, street and district
     * @param {CompletePostalCodeCityStreetDistrictOptions} options
     * @returns {Promise<{addresses: (PostalCodeCityStreetDistrict|undefined)}>}
     */
    function fetchPostalCodeCityStreetDistrictSuggestions(options) {
        return new Promise(((resolve, reject) => {
            $.get(`${controllerUrl}/completePostalCodeCityStreetDistrict`
                , options
                , (data) => resolve(data.data)
            )
                .fail(reject)
        }))
    }

    /**
     * Generate HTML from a list of suggestions which can be displayed to the user
     * @param {Array<(PostalCode|City|Street|District)>} completionSuggestions
     * @param {string} houseNo
     * @param {ListenerOptions} options
     * @param {string} containerSelector
     * @return {string}
     */
    function buildPopupHTML(completionSuggestions, houseNo, options, containerSelector) {
        let listItems = ""
        let count = 0;

        console.log({completionSuggestions})
        if (!completionSuggestions) {
            console.warn("no suggestions provided");
            return ``;
        }
        let updateContext;

        completionSuggestions.slice(0, 20).forEach(function (item) {
            let content = ``;

            /** @type {UpdateContext} */
            updateContext = {
                renderLocationId: containerSelector
            };

            let {
                street
                , postalCode
                , city
                , district
                , bundesland_short
            } = item

            if (street) {
                const fullStreet = `${street} ${houseNo}`
                content += fullStreet;
                updateContext.fullStreet = {
                    id: options.fullStreet.selector
                    , street: street
                    , houseNo: houseNo
                    , value: fullStreet
                }
            }

            if (postalCode) {
                if (content.length > 0) content += ", "
                content += postalCode;
                updateContext.postalCode = {
                    id: options.postalCode.selector
                    , value: postalCode
                }
            }

            if (city) {
                content += ` ${city}`
                updateContext.city = {
                    id: options.city.selector
                    , value: city
                }
            }

            if (district) {
                content += ` (${district})`
                updateContext.district = {
                    id: options.district.selector
                    , value: district
                }
            }

            if (bundesland_short){
                updateContext.bundesland_short = {
                    id: options.bundesland.selector
                    , value: bundesland_short
                }
            }

            listItems += `<li onclick='$.dhl._.updateInput(${JSON.stringify(updateContext)})'>${content}</li>`
        });
        /*console.log({updateContext:updateContext,listItems:listItems});
        console.log({city:$(options.city.selector).val(),city2:updateContext.city.value,
                     fullStreet:$(options.fullStreet.selector).val(),fullStreet2:updateContext.fullStreet.value,
                     postalCode:$(options.postalCode.selector).val(),postalCode2:updateContext.postalCode.value,
                     district:$(options.district.selector).val(),district2:updateContext.district.value,
                     bundesland:$(options.bundesland.selector).val(),bundesland2:updateContext.bundesland_short.value});*/
        if(updateContext != undefined && completionSuggestions.length==1)
        {
            if($(options.city.selector).val() == updateContext.city.value &&
               $(options.fullStreet.selector).val() == updateContext.fullStreet.value &&
               $(options.postalCode.selector).val() == updateContext.postalCode.value &&
               $(options.district.selector).val() == updateContext.district.value &&
               $(options.bundesland.selector).val() == updateContext.bundesland_short.value)
            {
                listItems = null;
            }

        }
        if(listItems != null)
        {
            return `<ul class="competition-suggestions">${listItems}</ul>`
        }
        else
        {
            return "";
        }
    }

    /**
     * @typedef {void|Window.jQuery|HTMLElement|*} jQueryReturn
     */

    /**
     * @typedef ListenerOptions
     * @type Object
     * @property {jQueryReturn} postalCode
     * @property {jQueryReturn} city
     * @property {jQueryReturn} fullStreet
     * @property {jQueryReturn} country
     * @property {jQueryReturn} district
     * @property {jQueryReturn} bundesland
     * @property {jQueryReturn} renderPopupLocation
     */

    /**
     * Outputs a warning if the creation of the DHL handler fails
     * @param {string} msg
     * @param {ListenerOptions|undefined} options
     */
    function createHandlerWarning(msg, options) {
        console.warn(`DHL Listener not created: ${msg}`, options)
    }


    /**
     * Return a listener function that can be used as a jquery event handler
     * @param {ListenerOptions} options
     * @param {boolean} renderAsPopover - If true the html will be injected instead of being appended
     * @param {function|undefined} onChange
     * @return {function}
     */
    function createHandler(options, renderAsPopover = true, onChange = undefined) {

        if (!options.renderPopupLocation?.length) return createHandlerWarning("no render location", options);
        if (!options.postalCode?.length) return createHandlerWarning("no postalCode", options);
        if (!options.city?.length) return createHandlerWarning("no city", options);
        if (!options.fullStreet?.length) return createHandlerWarning("no fullStreet", options);
        if (!options.district?.length) return createHandlerWarning("no district", options);
        if (!options.bundesland?.length) return createHandlerWarning("no bundesland", options);

        const _containerSelector = `${options.renderPopupLocation.selector}_suggestions`;
        const _containerID = `${options.renderPopupLocation.selector}_suggestions`.replace("#", "");

        let _postalCode = options.postalCode.val().trim();
        let _city = options.city.val().trim();
        let _fullStreet = options.fullStreet.val().trim();
        let _district = options.district.val().trim();
        let _popupHtml = '';
        let {street: _street, houseNo: _houseNo} = separateStreetAndHouseNo(_fullStreet);

        /**
         * Render the suggestion into the renderLocation
         */
        const rerenderHtmlToLocation = function () {
            console.debug(`rendering as popover ${renderAsPopover}`, _popupHtml, options.renderPopupLocation);
            if (renderAsPopover) {
                let container = $(_containerSelector)
                if (container.length === 0) {
                    options.renderPopupLocation.append(
                        `<div class="competition-suggestions-container" id="${_containerID}">${_popupHtml}</div>`
                    );
                } else {
                    container.html(_popupHtml)
                }
                return;
            }
            options.renderPopupLocation.html(_popupHtml);
        }


        /** @type {number} */
        let autoRunAutoCompleteTimer;
        let isRunningAutoComplete = false;

        /**
         * Runs on changes and fetches suggestions from the Dhl Controller
         * @description The function is limited to running once every 500ms to prevent to many requests to external servers
         * @returns {Promise<void>}
         */
        const runAutoComplete = async function () {

            if (isRunningAutoComplete) {
                if (autoRunAutoCompleteTimer) {
                    clearTimeout(autoRunAutoCompleteTimer)
                }
                autoRunAutoCompleteTimer = setTimeout(runAutoComplete, maxOneRequestPerMS)
                return;
            }

            isRunningAutoComplete = true;

            setTimeout(function () {
                isRunningAutoComplete = false;
            }, maxOneRequestPerMS);

            const postalCodeMeaningful = options.postalCode.val().length >= 3

            const postalCode = options.postalCode.val().trim()
                , city = options.city.val().trim()
                , fullStreet = options.fullStreet.val().trim()
                , country = options.country.val().trim()
                , district = options.district.val().trim();

            console.log(postalCode);

            if (!country || country && country === "") {
                console.warn("DHL completion skipped: no country")
                return;
            }

            const {street, houseNo} = separateStreetAndHouseNo(fullStreet)

            const cityChanged = _city !== city
                , postalCodeChanged = _postalCode !== postalCode
                , streetChanged = _fullStreet !== fullStreet
                , districtChanged = _district !== district;

            /** @type {Array<(PostalCode|City|Street|District)>|undefined} */
            let suggestions

            if (((postalCodeMeaningful || city.length > 0) && street.length > 0)) {
                const res = await fetchPostalCodeCityStreetDistrictSuggestions({
                    postalCode
                    , city
                    , street
                    , country
                    , district
                });
                suggestions = res.addresses
                $.app.toConsole({suggestions:suggestions});
                if(suggestions.length == 0)
                {
                    $(options.postalCode).addClass('border-red');
                    $(options.city).addClass('border-red');
                    $(options.fullStreet).addClass('border-red');
                }
                else
                {
                    $(options.postalCode).removeClass('border-red');
                    $(options.city).removeClass('border-red');
                    $(options.fullStreet).removeClass('border-red');
                }
            } else if (cityChanged || postalCodeChanged) {
                const res = await fetchPostalCodeCitySuggestions({postalCode, city, country})
                suggestions = res.addresses
            } else if (streetChanged) {
                const res = await fetchStreetSuggestions({street, country});
                suggestions = res.addresses;
            }
            console.log({suggestions:suggestions});
            if (suggestions) {
                _popupHtml = buildPopupHTML(suggestions, houseNo, options, _containerSelector);
                rerenderHtmlToLocation();
            } else {
                console.warn("Attempt to autocomplete failed, since no valid suggestions were returned")
            }

            _postalCode = postalCode;
            _fullStreet = fullStreet;
            _street = street;
            _houseNo = houseNo;
            _city = city

            if ((cityChanged || postalCodeChanged || streetChanged || districtChanged) && onChange) onChange()
        }

        $.dhl._.handlers.add({
            runAutoComplete
            , rerenderHtmlToLocation
        })

        return runAutoComplete;
    }


    /**
     * @param {string}fullStreet
     * @returns {{street: string, houseNo: string}}
     */
    const separateStreetAndHouseNo = function (fullStreet) {
        const reg = /\d/i; // at least one digit
		let houseNo = "";
		let street = fullStreet.trim();
        let streesplit = street.split(" ");

        // if we have several space separated words check if last on contains an digit.
		// If yes take last word as house number.
        if (streesplit.length > 1 && streesplit[streesplit.length-1].match(reg)) {
			houseNo = streesplit[streesplit.length-1].trim();
			street = streesplit.slice(0,streesplit.length-1).join(" ").trim();
        }

        return {
            // remove special characters
            street: street.replaceAll(/[^\w\säöüß]/gi, '').trim(),
            houseNo: houseNo
        }
    }

    /**
     * @param {UpdateContext} context
     */
    function updateInput(context) {

        if (context.postalCode) {
            $(context.postalCode.id).val(context.postalCode.value);
        }
        if (context.city) {
            $(context.city.id).val(context.city.value);
        }
        if (context.fullStreet) {
            $(context.fullStreet.id).val(context.fullStreet.value)
        }
        if (context.district) {
            $(context.district.id).val(context.district.value)
        }
        if (context.bundesland_short) {
            $(context.bundesland_short.id).val(context.bundesland_short.value);
            $(context.bundesland_short.id).trigger("change");
        }
        $(context.renderLocationId).empty();
    }

    $.dhl = {
        createHandler
        , fetchCitySuggestion
        , fetchStreetSuggestions
        , fetchPostalCodeSuggestions
        , fetchPostalCodeCitySuggestions
        , fetchPostalCodeCityStreetSuggestions
        , _: {
            updateInput
            , handlers: new Set()
        }
    }
}
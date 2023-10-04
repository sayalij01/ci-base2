<?php 
	/**
	 * This helper is intended to validate address data
	 *
	 * @author Vincent Menzel
	 * @category helper
	 * @package application\helpers
	 * @version 1.0
	 */

	if (!function_exists("sendAuthenticatedDHLRequest")) {
		/**
		 * @param string $url
		 * @return BASE_Result
		 * @throws Exception
		 */
		function sendAuthenticatedDHLRequest(string $url): BASE_Result
		{
			$ci =& get_instance();
			$ci->load->model("dhl_model");

			$requestBaseUrl = "https://autocomplete2.postdirekt.de/autocomplete2";

			// DHL API requires multipart names to be separated by "%20" instead of "+"
			$formattedUrl = strtolower(str_replace("+", "%20", $url));

			$targetUrl = "${requestBaseUrl}${formattedUrl}";

			$bearer = $ci->dhl_model->getValidBearer();

			$curl = curl_init();

			curl_setopt_array(
				$curl,
				[
					CURLOPT_URL => $targetUrl,
					CURLOPT_RETURNTRANSFER => true,
					CURLOPT_ENCODING => "",
					CURLOPT_MAXREDIRS => 10,
					CURLOPT_TIMEOUT => 30,
					CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
					CURLOPT_CUSTOMREQUEST => "GET",
					CURLOPT_POSTFIELDS => "",
					CURLOPT_HTTPHEADER => [
						"Authorization: Bearer ${bearer}",
					],
				]
			);

			$response = curl_exec($curl);
			$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
			$err = curl_error($curl);

			curl_close($curl);

			if ($err) {
				return new BASE_Result(null, $err, ["target" => $targetUrl], E_STATUS_CODE::ERROR);
			}

			if ($httpCode >= 300 || $httpCode < 200) {
				write2Debugfile(
					"dhl_helper".time(),
					"Failed to get a valid response \n res: ${response} \n bearer ${bearer} \n HTTP_CODE: ${httpCode}"
				);

				return new BASE_Result(null, [
					'statusCode' => $httpCode
					, "target" => $targetUrl
				], null, E_STATUS_CODE::ERROR);
			}
			try {
				return new BASE_Result(json_decode($response, true, 512, JSON_THROW_ON_ERROR), ["target" => $targetUrl]);
			} catch (JsonException $e) {
				return new BASE_Result(null, $e, ["target" => $targetUrl], E_STATUS_CODE::ERROR);
			}
		}
	}


	if (!function_exists("completePLZ")) {
		/**
		 * @param string $plz
		 * @param string $country
		 * @return BASE_Result
		 * @throws Exception
		 */
		function completePLZ(string $plz, string $country = "de"): BASE_Result
		{
			$targetUrl = "/search/${country}/postalcodes?postal_code=${plz}";

			return sendAuthenticatedDHLRequest($targetUrl);
		}
	}

	if (!function_exists("completeStreet")) {
		/**
		 * @param string $street
		 * @param string $country
		 * @return BASE_Result
		 * @throws Exception
		 */
		function completeStreet(string $street, string $country = "de"): BASE_Result
		{
			$targetUrl = "/search/${country}/streets?street=${street}";

			return sendAuthenticatedDHLRequest($targetUrl);
		}
	}

	if (!function_exists("completeCity")) {
		/**
		 * @param string $city
		 * @param string $country
		 * @return BASE_Result
		 * @throws Exception
		 */
		function completeCity(string $city, string $country = "de"): BASE_Result
		{
			$targetUrl = "/search/${country}/cities?city=${city}";

			return sendAuthenticatedDHLRequest($targetUrl);
		}
	}

	if (!function_exists("completeCityPostalCode")) {
		/**
		 * @param string $plz
		 * @param string $city
		 * @param string $country
		 * @return BASE_Result
		 * @throws Exception
		 */
		function completeCityPostalCode(string $plz, string $city, string $country = "de"): BASE_Result
		{
			$targetUrl = "/search/${country}/postalcodes_cities?postal_code=${plz}&city=${city}";

			return sendAuthenticatedDHLRequest($targetUrl);
		}
	}

	if (!function_exists("completePLZCityStreet")) {
		/**
		 * @param string $plz
		 * @param string $city
		 * @param string $street
		 * @param string $country
		 * @return BASE_Result
		 * @throws Exception
		 */
		function completePLZCityStreet(string $plz, string $city, string $street, string $country = "de"): BASE_Result
		{
			$targetUrl = "/search/${country}/postalcodes_cities_streets?=&=&street=${street}&city=${city}&postal_code=${plz}";

			return sendAuthenticatedDHLRequest($targetUrl);
		}
	}
	if (!function_exists("completePostalCodeCityStreetDistrict")) {
		/**
		 * @param array $options
		 * @param string $country
		 * @return BASE_Result
		 * @throws Exception
		 */
		function completePostalCodeCityStreetDistrict(
			array $options = ["country" => null, "street" => "", null, "city" => null, "postal_code" => null],
			string $country = "de"
		) {
			$queryParams = http_build_query($options);
			$target = "/search/${country}/postalcodes_cities_districts_streets?${queryParams}";

			return sendAuthenticatedDHLRequest($target);
		}
	}
<?php  
/**
 * Definition of all table names
 */
define("DATABASE_NAME", "abena");
define('TABLE_PREFIX', 'app_');
define('MODEL_PREFIX', 'model_');

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: APP ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_APP', 'app');											                    // application version etc.
define('TBL_APP_SETTINGS', TABLE_PREFIX.'_settings');									// application settings
define('TBL_APP_SESSIONS', TABLE_PREFIX.'_sessions');				                    // sessions table
define('TBL_APP_MENU', TABLE_PREFIX.'_menu');						                    // menu items
define('TBL_APP_NAV', TABLE_PREFIX.'_nav');												// top navigation items (no permissions required)
define('TBL_APP_LINKS', TABLE_PREFIX.'_links');											// Links
define('TBL_APP_PW_BLACKLIST', TABLE_PREFIX.'_pw_blacklist');							// blacklisted password parts

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: CLIENTS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_CLIENTS', TABLE_PREFIX.'clients');						                    // application clients
define('TBL_DOMAIN_CONFIG', TABLE_PREFIX.'_domain_config');						    	// custom, domain depending configs

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: APP_LOG ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_LOG_ACCESS', TABLE_PREFIX.'log__access');				                    // log controller access
define('TBL_LOG_DATABASE', TABLE_PREFIX.'log__database');			                    // log database actions
define('TBL_LOG_TASKS', TABLE_PREFIX.'log__tasks');					                    // log sheduled task executions
define('TBL_LOG_EMAIL', TABLE_PREFIX.'log__email');					                    // log sent emails

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: ROLES & RIGHTS :::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_ROLES', TABLE_PREFIX.'roles');							                    // roles table (permission groups)
define('TBL_ROLES_RIGHTS', TABLE_PREFIX.'roles__rights');			                    // permissions 2 roles relation table

define('TBL_RIGHTS', TABLE_PREFIX.'_rights');						                    // permissions table

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: TEMPLATES ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_TEMPLATES_EMAIL', TABLE_PREFIX.'templates__mails');		                    // templates for emails

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: USER :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_USER', TABLE_PREFIX.'user');                                                // application users
define('TBL_USER_PW_HISTORY', TABLE_PREFIX.'user__pw_history');							// password history
define('TBL_USER_ROLES', TABLE_PREFIX.'user__roles');				                    // roles 2 user relation table

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: CONTRACTS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_CONTRACTS', 'ab_contracts');                                     			// Verträge
define('TBL_CONTRACTS_DETAILS', 'ab_contracts__details');                               // Vertragsdetails
define('TBL_CONTRACTS_DOCUMENTS', 'ab_contracts__documents');							// Vertragsdokumente
define('TBL_CONTRACTS_INSURANCES', 'ab_contracts__insurances');                         // Kassen zu Vertrag
define('TBL_CONTRACTS_FLATRATES', 'ab_contracts__flatrates');                           // Pauschalen zu Vertrag
define('TBL_CONTRACTS_DOC_PLACEHOLDER','ab_contracts__doc_placeholder');                // Dokumentensetups
define('TBL_CONTRACTS_DOC_PLACEHOLDER_MAP','ab_contracts__doc_placeholder_map');        // Dokumentensetups Mapping
define('TBL_CONTRACTS_FURTHER_INFO', 'ab_contracts__further_information');                                     			// zusätzliche Informationen
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: ARTICLES :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_ARTICLES', 'ab_articles');													// Artikel
define('TBL_ARTICLES_PRICES', 'ab_articles__unit_prices');								// Artikel-Preise und Einheiten
define('TBL_ARTICLES_CONVERT', 'ab_articles__unit_convert');							// Artikel Einheiten Konvertierung
define('TBL_ARTICLES_DETAILS', 'ab_articles__unit_details');							// Artikel Einheiten
define('TBL_ARTICLES_INVENTORY', 'ab_articles__inventory');							// Artikel Einheiten
define('TBL_ARTICLES_NUMBERS_TO_FLATRATES', 'ab_articles__numbers_to_flatrates');

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: HEALTH INSURANCE :::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_INSURANCES', 'ab_health_insurances');										// Krankenkasse
define('TBL_HEALTH_INSURANCES', 'ab_health_insurances');								// Alias Krankenkasse
define('TBL_HEALTH_INSURANCES_BILLING_MAPPING', 'ab_health_insurances__billing_account_mapping');	// Mapping Rechnungskonto

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: SGB HEALTH INSURANCE :::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_SGB_HEALTH_NSURANCE_COSTCARRIER', 'ab_sgb_health_insurance__costcarrier');
define('TBL_SGB_HEALTH_NSURANCE_ANS', 'ab_sgb_health_insurance__ans');
define('TBL_SGB_HEALTH_NSURANCE_ASP', 'ab_sgb_health_insurance__asp');
define('TBL_SGB_HEALTH_NSURANCE_DFU', 'ab_sgb_health_insurance__dfu');
define('TBL_SGB_HEALTH_NSURANCE_UEM', 'ab_sgb_health_insurance__uem');
define('TBL_SGB_HEALTH_NSURANCE_VKG', 'ab_sgb_health_insurance__vkg');
define('TBL_SGB_HEALTH_NSURANCE_IMPORTS', 'ab_sgb_health_insurance__imports');

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: DEBITOR ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_DEBITOR', 'ab_debitor');
define('TBL_DEBITOR_BANK_ACCOUNTS', 'ab_debitor__bank_accounts');
define('TBL_DEBITOR_BILLING_ACCOUNTS', 'ab_debitor__billing_accounts');
define('TBL_DEBITOR_CONTACTS', 'ab_debitor__contacts');
define('TBL_DEBITOR_CONTRACTS', 'ab_debitor__contracts');
define('TBL_DEBITOR_DELIVERY_ACCOUNTS', 'ab_debitor__delivery_accounts');
define('TBL_DEBITOR_DETAILS', 'ab_debitor__details');
define('TBL_DEBITOR_DOCUMENTS', 'ab_debitor__documents');
define('TBL_DEBITOR_ORDERS', 'ab_debitor__orders');
define('TBL_DEBITOR_ORDERS_ARTICLES', 'ab_debitor__orders__articles');
// define('TBL_DEBITOR_SCHEDULED_ORDERS', 'ab_debitor__scheduled_orders');
define('TBL_DEBITOR_KV', "ab_debitor__kv");
define('TBL_DEBITOR_COYPAMENT_NO_CHARGE', 'ab_debitor__copayment_no_charge');

//  Dhl Auth
define('TBL_DHL_AUTH', 'app_dhl_auth');
// Autocomplete
define('TBL_AUTOCOMPLETE', 'ab_autocomplete');
define('TBL_DEBITOR_CONTACT_HISTORY', "ab_debitor__contact_history");                               // Debitor Kontakt Historie
define("TBL_DEBITOR_BLACKLIST", "ab_debitor__blacklist");
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: MODELS :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_TEAMS', 'ab_model__teams');
define('TBL_DELIVERY_SERVICES', 'ab_model__delivery_services');
define('TBL_DELIVERY_OPTIONS', 'ab_model__delivery_options');
define('TBL_DELIVERY_TERMS', 'ab_model__delivery_terms');
define('TBL_STORAGE_LOCATIONS', 'ab_model__storage_locations');
define('TBL_PAYMENT_TERMS', 'ab_model__payment_terms');
define('TBL_TAX_GROUPS', 'ab_model__tax_groups');
define('TBL_BANK_GROUPS', 'ab_model__bank_groups');
define('TBL_CARELEVEL', "ab_model__care_level"); // Pflegegrade
define('TBL_CARE_PROVIDER_GROUP', "ab_model__care_provider_group"); // Leistungserbringergruppe
define('TBL_S_ACCOUNT', "ab_model__s_account");
define('TBL_PAYMENT_MODEL', "ab_model__payment_model");
define('TBL_PAYMENT_CURRENCY', "ab_model__payment_currency");
define('TBL_PRICE_GROUP', "ab_model__price_group");
define('TBL_DISCOUNT', "ab_model__discount");
define('TBL_PAYMENT_METHOD', "ab_model__payment_method");
define('TBL_DEBITOR_ANAMNESIS', "ab_debitor__anamnese");
define('TBL_CONTACT_TYPES', "ab_model__contact_type");
define('TBL_CUSTOMER_KIND', "ab_model__customer_kind");
define('TBL_CUSTOMER_GROUP', "ab_model__customer_group");
define('TBL_CUSTOMER_TYPE', "ab_model__customer_type");
define('TBL_TIME_RANGES', "ab_model__time_ranges");
define('TBL_LOCK_REASONS', "ab_model__lock_reasons");

define('TBL_ARTICLE_GROUP', "ab_model__article_groups");
define('TBL_STATISTIC_GROUP', "ab_model__statistic_groups");
define('TBL_DEBITOR_GROUP', "ab_model__debitor_groups");

define('TBL_CONTACT_TITLE', "ab_model__contact_title");
define('TBL_EXTERNAL_NOTES', "ab_model__external_note_phrases");
define('TBL_STATISTIC_GROUP_DEBITOR', "ab_model__statistic_groups_debitor");
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: DOCTORS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_DOCTORS', 'ab_doctors');													// Ärzte

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: DOCUMENTS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_DOCUMENT_TYPES', 'ab_document_types');

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: PRESCRIPTIONS  :::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_PRESCRIPTIONS', 'ab_prescriptions');
define('TBL_PRESCRIPTIONS_ATTACHMENTS', 'ab_prescriptions__attachments');
define('TBL_PRESCRIPTIONS_ARTICLES', 'ab_prescriptions__articles');
define('TBL_PRESCRIPTIONS_KV', 'ab_prescriptions__kv');						//Kostenvoranschlag pro Rezept



// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: REMINDER  :::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_REMINDER', 'ab_reminder');
define('TBL_SELECTABLE_REMINDER_TYPES', 'ab_model__selectable_reminder_types');

//
//ab_order__sample_order_accounts
define('TBL_SAMPLE_SALES_GROUPS', "ab_order__sample_order_accounts");

define('TBL_ORDERS', "ab_debitor__orders");
define('TBL_ORDERS_ARTICLES', "ab_debitor__orders__articles");
define('TBL_ORDER_POOL', "ab_order__order_pool");

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: WEBSERVICE  :::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_SCANAGENT_OCRFIELDS','ab_scanagent_ocrfields');
define('TBL_SCANAGENT_DATA','ab_scanagent_data');

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: GENERIC MODELS :::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_CONTINENS', MODEL_PREFIX."_continents");						            // continents table
define('TBL_CONTINENS_L18N', MODEL_PREFIX."_continents_l18n");				            // continents localizations
define('TBL_COUNTRIES', MODEL_PREFIX."_countries");						                // country table
define('TBL_COUNTRIES_L18N', MODEL_PREFIX."_countries_l18n");				            // country localizations
define('TBL_LOCALES', TABLE_PREFIX."locales");							                // available localizations / supported application languages
define('TBL_LOCALES_L18N', 'app_locales__l18n');								// actually the translations
define('TBL_SUBDIVISIONS', MODEL_PREFIX."_subdivisions");				    			// Bundesländer
define('TBL_HISTORY', TABLE_PREFIX."history");								            // History
define('TBL_HISTORY_DETAILS', TABLE_PREFIX."history__details");                         //History Daten
define('TBL_HIMI_PRODUCT_TYPE', "ab_model__himi_product_type");                         //himi Produkt Typen
define('TBL_HIMI_PRODUCT_FEATURE', "ab_model__product_special_features");               //Werte Produktbesonderheiten
define('TBL_COPAYMENT_TYPE', "ab_model__copayment_type");                               //Zuzahlungsarten

define('TBL_DEBITOR_CONTACT_HISTORY_PLOT', "ab_model__inhabitant_contact_plot");        // Kontakthandlung
define('TBL_DEBITOR_CONTACT_HISTORY_CONTENT', "ab_model__inhabitant_contact_content");  // Kontaktinhalt
define('TBL_DEBITOR_CONTACT_HISTORY_TYPES', "ab_model__inhabitant_contact_types");      //Kontaktart

// Tasks
define('TBL_ARTICLE_RELAUNCH', "ab_article_relaunch");                                  //Article Relaunch Daten
define('TBL_ARTICLE_RELAUNCH_TASKSETTINGS', "ab_article_relaunch_tasksettings");        //Task Einstellungen für Article Relaunch
define('TBL_PRESCRIPTON_COPY_LOG', "ab_prescriptions_copy_log");
define('TBL_SUPERVISOR_DATA', "ab_supervisor_data");
define('TBL_MODEL_KAM_GROUPS', "ab_model__kam_groups");
define('TBL_TELESALES_GROUPS', "ab_model__telesale_group");
define('TBL_SUPERVISOR_SALES_GROUP', "ab_model__supervisor_sales_group");
define('TBL_SUPERVISOR_ORDER_POOL', "ab_model__order_pool_supervisor");
define('TBL_SUPERVISOR_COSTUNIT', "ab_model__supervisor_costunit");
define('TBL_SUPERVISOR_DELIVERY_OPTIONS', "ab_model__delivery_options_supervisor");
define('TBL_LFS_TYPES','ab_model__lfs_type');
/* End of file db_tables.php */
/* Location: ./application/config/db_tables.php */

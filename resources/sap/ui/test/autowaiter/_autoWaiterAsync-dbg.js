/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"jquery.sap.global",
	"sap/ui/test/_OpaLogger",
	"sap/ui/test/_ParameterValidator",
	"sap/ui/test/autowaiter/_autoWaiter",
	"sap/ui/test/autowaiter/_autoWaiterLogCollector"
], function ($, _OpaLogger, _ParameterValidator, _autoWaiter, _autoWaiterLogCollector) {
	"use strict";

	var oLogger = _OpaLogger.getLogger("sap.ui.test.autowaiter._autoWaiterAsync");
	var oConfigValidator = new _ParameterValidator({
		errorPrefix: "sap.ui.test.autowaiter._autoWaiterAsync#extendConfig"
	});
	var bWaitStarted;
	var sLastAutoWaiterLog;
	var config = {
		interval: 400, // milliseconds
		timeout: 15 // seconds
	};

	function extendConfig(oConfig) {
		validateConfig(oConfig);
		$.extend(config, oConfig);
		_autoWaiter.extendConfig(config);
	}

	function waitAsync(fnCallback) {
		// start only one waiter at a time to prevent interference between the timeout detection of multiple waiters
		if (bWaitStarted) {
			notifyCallback({error: "waitAsync is already running and cannot be called again at this moment"});
			return;
		}

		var pollStartTime = Date.now();
		bWaitStarted = true;
		oLogger.debug("Start polling to check for pending asynchronous work");
		_autoWaiterLogCollector.start();
		fnCheck();

		function fnCheck() {
			var pollTimeElapsed = (Date.now() - pollStartTime) / 1000;
			if (pollTimeElapsed <= config.timeout) {
				if (!_autoWaiter.hasToWait()) {
					notifyCallback({log: "Polling finished successfully. There is no more pending asynchronous work for the moment"});
					bWaitStarted = false;
				} else {
					sLastAutoWaiterLog = _autoWaiterLogCollector.getAndClearLog();
					setTimeout(fnCheck, config.interval);
				}
			} else {
				notifyCallback({error: "Polling stopped because the timeout of " + config.timeout +
					" seconds has been reached but there is still pending asynchronous work.\n" +
					"This is the last log of pending work:\n" + sLastAutoWaiterLog});
				bWaitStarted = false;
			}
		}

		function notifyCallback(mResult) {
			if (fnCallback) {
				fnCallback(mResult.error);
			}
			oLogger.debug(mResult.error || mResult.log);
			_autoWaiterLogCollector.stop();
		}
	}

	function validateConfig(oConfig) {
		oConfigValidator.validate({
			inputToValidate: oConfig,
			validationInfo: {
				interval: "numeric",
				timeout: "numeric",
				timeoutWaiter: "object"
			}
		});

		if (oConfig.timeout <= 0 || oConfig.interval <= 0) {
			throw new Error("Invalid polling config: Timeout and interval should be greater than 0");
		}
	}

	return {
		extendConfig: extendConfig,
		waitAsync: waitAsync
	};
}, true);

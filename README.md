# Kaholo Xray Test Management Plugin
[Xray](https://www.getxray.app/?hsLang=en) is a test management application for [Jira](https://www.atlassian.com/software/jira), the issue tracking system by Atlassian. Xray adds issue types to Jira for Test-related items.
* Precondition - configuration/data that must be in place before a test can be run
* Test - a test case
* Test Set - a collection of tests
* Test Plan - a issue representing the intent to execute test(s)
* Test Execution - the results of having conducted a test

These issues are then associated with standard Jira Bugs, Tasks, Stories, etc. using relationship such as "is tested by". Test results can be recorded manually using Jira, including associated comments and evidence such as screen shots or output files, and the test status of each requirement is then visible and reportable using Jira (with Xray) as a complete test management solution.

The primary purpose of this plugin is to report results from automated tests to Xray so they are also visible and reportable using Jira. Xray has an API to accept such results. The triggering of automated testing is most commonly accomplished not via Jira or Xray, but using web hooks triggered by checking in of code, for example in GitHub. To close the loop from GitHub to Jira, the automation needs to be aware of the Jira item ID of the test it is conducting. This and other details of the test result are composed into an [XRay JSON Document](https://docs.getxray.app/display/XRAY/Import+Execution+Results#ImportExecutionResults-XrayJSONSchema) for import by the plugin.

Below is the simplest example of a Test Result JSON document that might be sent to Xray using the plugin. In this case Jira item `ABC-129` is an issue type "Test", and this result will create a new Jira item of type "Test Execution" to record that the test was conducted and passed.

    {
    "tests" : [
        {
            "testKey" : "ABC-129",
            "start" : "2014-08-30T11:47:35+01:00",
            "finish" : "2014-08-30T11:50:56+01:00",
            "comment" : "Successful execution",
            "status" : "PASSED"
        }
    ]
    }

## Prerequisites
This plugin requires that there is a Jira implementation with Xray installed, and a user account with sufficient privileges to configure Xray in Project Settings | Apps | Xray Settings. Consult the Xray documentation for details how to do this. You also need sufficient Jira permissions to generate an API Key for the Xray App, unless an Xray API Key has been generated for you. 

## Access and Authentication
The Xray API Key can be created in Jira Settings | Apps, and then under section "Xray", API Keys. Here, click button "Create Key" to get both Client ID and Client Secret. Note that this is NOT the same type of Jira API Keys one can get via Atlassian Administration. Xray uses a different endpoint and API Key than Jira. If you intend to use both the Kaholo Jira plugin and the Xray one, you'll need two sets of API keys.

An Xray API Key looks something like this:

    {
        "client_id": "E1D2095082A848B5BAF0B095082A2AA4",
        "client_secret": "dee7fe7ec198f7e5d62fe17cf234y4w184edad1ee998f7e5d620efbb6513148"
    }

The plugin uses the provided Xray API Key to authenticate at https://xray.cloud.getxray.app and receive a JWT token, and then uses the token to submit test execution results. This endpoint for Xray Cloud APIs is coded into the plugin. If you have an on-premise deployment of Jira and Xray, some modification may be necessary.

The plugin uses a Kaholo Account that consists of the Xray API Key's Client ID and Client Secret. The Client Secret is stored in the Kaholo Vault. This prevents the secret from being visible in the configuration of Xray Actions in the pipeline or appearing in execution or error logs.

## Plugin Installation
For download, installation, upgrade, downgrade and troubleshooting of plugins in general, see [INSTALL.md](./INSTALL.md).

## Plugin Settings
There are no Default settings for this plugin.

## Method: Import Xray JSON Execution Results
This method imports execution results in the form of an [XRay JSON Document](https://docs.getxray.app/display/XRAY/Import+Execution+Results#ImportExecutionResults-XrayJSONSchema). The only parameter is Xray Execution Results, which is a JSON document of the appropriate format. The document can be very simple or quite complex depending on the design of the test and the results. For example it can include many test steps, results for more than one test at a time, and may include comments and screenshots. Please see the Xray documentation for more details.

Xray does include APIs for importing types of test result other than the XRay JSON Schema. For example Cucumber JSON, JUnit XML, and NUnit. If you have a use case for these or other types please [do let us know](https://kaholo.io/contact/).

A JSON file may be pasted into the parameter to test the Xray plugin, but when using the plugin to send the results of automated tests, the JSON document is more likely going to be provided by an earlier Action in the Pipeline (the automated test), and will be passed as a object in the code layer. For example, if the JSON is in a file named testresult.json, use the JSON plugin with method "Parse JSON file" to put the contents of the file in its own Final Result. This will leave the JSON in variable `kaholo.actions.json1.result` where `json1` matches the ID of the Action doing the JSON parsing. Next, toggle the code switch for parameter `Xray Execution Results`, and there put `kaholo.actions.json1.result`. This way whatever testresult.json the automated test writes, it'll be what gets imported into Xray in your pipeline.

## Method: Import Cucumber JSON Execution Results
This method is the same as method "Import Xray JSON Execution Results", however the input must be appropriately formatted Cucumber JSON, not Xray. These are generated by running cucumber with the switch `-f json`.

## Method: Import JUnit XML Execution Results
This method is the same as method "Import Xray JSON Execution Results", however the input must be appropriately formatted JUnit XML, not Xray. There are also a few additional parameters to fit the JUnit results to the appropriate Xray items in Jira.

## Method: Create Execution Result
This method creates an Xray format execution result for import from a set of parameters. Use this method if your requirements are simple and your automated tests provide no JSON or XML results document to import.
* **Jira Project ID** - The project ID of the Jira project containing the Xray Test issue
* **Execution Result Summary** - A text summary of the test result
* **Execution Result Description** - A text description of the test result
* **Test Environments** - The test environment, which must match one that is configured in Xray (If more than one environment applies, enter one per line.)
* **Execution Timestamp** - A time in ISO format representing both start and finish time of the test
* **Jira User** - The name of the Jira user associated with this test result
* **Test Result Comment** - Text commentary regarding the test result
* **Test Result Status** - The status of the test execution being created
* **Associated Test** - The Jira item number of the Test to which the Test Execution is related

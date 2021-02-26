// Testing deploybot

(function() {
  // Defaults for API query string
  var fiscalYear = '2015',
      majAgencyCat = '1600',
      maxRecords = '1000';

  // Create the connector object
  var myConnector = tableau.makeConnector();

  // Define the schema
  myConnector.getSchema = function(schemaCallback) {
    var cols = [{
      id: "piid",
      alias: "Piid",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "unique_transaction_id",
      alias: "Unique Transaction Id",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "A76Action",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "account_title",
      alias: "Account Title",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "Vendorname",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "Dollarsobligated",
      alias: "Dollars Obligated",
      dataType: tableau.dataTypeEnum.float
    }, {
      id: "Baseandexercisedoptionsvalue",
      dataType: tableau.dataTypeEnum.float
    }, {
      id: "Baseandalloptionsvalue",
      dataType: tableau.dataTypeEnum.float
    }, {
      id: "maj_agency_cat",
      alias: "Maj Agency Cat",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "mod_agency",
      alias: "Mod Agency",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "maj_fund_agency_cat",
      alias: "Maj Fund Agency Cat",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "contractingofficeagencyid",
      alias: "Contractingofficeagencyid",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "contractingofficeid",
      alias: "Contractingofficeid",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "fundingrequestingagencyid",
      alias: "Fundingrequestingagencyid",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "fundingrequestingofficeid",
      alias: "Fundingrequestingofficeid",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "fundedbyforeignentity",
      alias: "Fundedbyforeignentity",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "signeddate",
      alias: "Signeddate",
      dataType: tableau.dataTypeEnum.date
    }, {
      id: "effectivedate",
      alias: "Effectivedate",
      dataType: tableau.dataTypeEnum.date
    }, {
      id: "currentcompletiondate",
      alias: "Currentcompletiondate",
      dataType: tableau.dataTypeEnum.date
    }, {
      id: "ultimatecompletiondate",
      alias: "Ultimatecompletiondate",
      dataType: tableau.dataTypeEnum.date
    }, {
      id: "lastdatetoorder",
      alias: "Lastdatetoorder",
      dataType: tableau.dataTypeEnum.date
    }, {
      id: "contractactiontype",
      alias: "Contractactiontype",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "reasonformodification",
      alias: "Reasonformodification",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "typeofcontractpricing",
      alias: "Typeofcontractpricing",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "priceevaluationpercentdifference",
      alias: "Priceevaluationpercentdifference",
      dataType: tableau.dataTypeEnum.float
    }, {
      id: "subcontractplan",
      alias: "Subcontractplan",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "lettercontract",
      alias: "Lettercontract",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "multiyearcontract",
      alias: "Multiyearcontract",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "performancebasedservicecontract",
      alias: "Performancebasedservicecontract",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "majorprogramcode",
      alias: "Majorprogramcode",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "contingencyhumanitarianpeacekeepingoperation",
      alias: "Contingencyhumanitarianpeacekeepingoperation",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "contractfinancing",
      alias: "Contractfinancing",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "costorpricingdata",
      alias: "Costorpricingdata",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "costaccountingstandardsclause",
      alias: "Costaccountingstandardsclause",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "descriptionofcontractrequirement",
      alias: "Descriptionofcontractrequirement",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "purchasecardaspaymentmethod",
      alias: "Purchasecardaspaymentmethod",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "numberofactions",
      alias: "Numberofactions",
      dataType: tableau.dataTypeEnum.float
    }, {
      id: "nationalinterestactioncode",
      alias: "Nationalinterestactioncode",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "progsourceagency",
      alias: "Progsourceagency",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "progsourceaccount",
      alias: "Progsourceaccount",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "progsourcesubacct",
      alias: "Progsourcesubacct",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "vendoralternatename",
      alias: "Vendoralternatename",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "vendorlegalorganizationname",
      alias: "Vendorlegalorganizationname",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "streetaddress",
      alias: "Streetaddress",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "city",
      alias: "City",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "state",
      alias: "State",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "zipcode",
      alias: "Zipcode",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "vendorcountrycode",
      alias: "Vendorcountrycode",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "vendor_state_code",
      alias: "Vendor State Code",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "congressionaldistrict",
      alias: "Congressionaldistrict",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "vendorsitecode",
      alias: "Vendorsitecode",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "vendoralternatesitecode",
      alias: "Vendoralternatesitecode",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "dunsnumber",
      alias: "Dunsnumber",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "parentdunsnumber",
      alias: "Parentdunsnumber",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "registrationdate",
      alias: "Registrationdate",
      dataType: tableau.dataTypeEnum.date
    }, {
      id: "renewaldate",
      alias: "Renewaldate",
      dataType: tableau.dataTypeEnum.date
    }, {
      id: "mod_parent",
      alias: "Mod Parent",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "statecode",
      alias: "Statecode",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "placeofperformancecity",
      alias: "Placeofperformancecity",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "pop_state_code",
      alias: "Pop State Code",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "placeofperformancecountrycode",
      alias: "Placeofperformancecountrycode",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "placeofperformancezipcode",
      alias: "Placeofperformancezipcode",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "pop_cd",
      alias: "Pop Cd",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "psc_cat",
      alias: "Psc Cat",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "productorservicecode",
      alias: "Productorservicecode",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "principalnaicscode",
      alias: "Principalnaicscode",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "gfe_gfp",
      alias: "Gfe Gfp",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "agencyid",
      alias: "Agencyid",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "fiscal_year",
      alias: "Fiscal Year",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "extentcompeted",
      alias: "Extentcompeted",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "typeofsetaside",
      alias: "Typeofsetaside",
      dataType: tableau.dataTypeEnum.string
    }
  ];

    var tableSchema = {
      id: "USASpending",
      alias: "Contracts from USASpending API",
      columns: cols
    };

    schemaCallback([tableSchema]);
  };

  // Download the data
  myConnector.getData = function(table, doneCallback) {
    var url = "https://www.usaspending.gov/fpds/fpds.php?detail=c&fiscal_year=" + fiscalYear + "&maj_agency_cat="+ majAgencyCat + "&max_records=" + maxRecords + "&sortby=f";

    $.ajax({
    	url: "xmlproxy.php?url=" + escape(url),
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    	success: function(resp) {
        var data = JSON.parse(resp)
        // console.log(data);
        var docs;
        // console.log(docs);
        var tableData = [];

        if ( data.result.doc.length ) {
          docs = data.result.doc;

          for (var i = 0, len = docs.length; i < len; i += 1) {
            // console.log(docs[i]);
            tableData.push({
              "piid": docs[i].PIID,
              "unique_transaction_id": docs[i].unique_transaction_id,
              "A76Action": docs[i].A76Action,
              "account_title": docs[i].account_title,
              "Vendorname": docs[i].vendorName,
              "Dollarsobligated": docs[i].obligatedAmount,
              "Baseandexercisedoptionsvalue": docs[i].baseAndExercisedOptionsValue,
              "Baseandalloptionsvalue": docs[i].baseAndAllOptionsValue,
              "maj_agency_cat": docs[i].maj_agency_cat,
              "mod_agency": docs[i].mod_agency,
              "maj_fund_agency_cat": docs[i].maj_fund_agency_cat,
              "contractingofficeagencyid": docs[i].contractingOfficeAgencyID,
              "contractingofficeid": docs[i].contractingOfficeID,
              "fundingrequestingagencyid": docs[i].fundingRequestingAgencyID,
              "fundingrequestingofficeid": docs[i].fundingRequestingOfficeID,
              "fundedbyforeignentity": docs[i].fundedByForeignEntity,
              "signeddate": docs[i].signedDate,
              "effectivedate": docs[i].effectiveDate,
              "currentcompletiondate": docs[i].currentCompletionDate,
              "ultimatecompletiondate": docs[i].ultimateCompletionDate,
              "lastdatetoorder": docs[i].LastDateToOrder,
              "contractactiontype": docs[i].contractActionType,
              "reasonformodification": docs[i].reasonForModification,
              "typeofcontractpricing": docs[i].typeOfContractPricing,
              "priceevaluationpercentdifference": docs[i].priceEvaluationPercentDifference,
              "subcontractplan": docs[i].subcontractPlan,
              "lettercontract": docs[i].letterContract,
              "multiyearcontract": docs[i].multiYearContract,
              "performancebasedservicecontract": docs[i].performanceBasedServiceContract,
              "majorprogramcode": docs[i].majorProgramCode,
              "contingencyhumanitarianpeacekeepingoperation": docs[i].contingencyHumanitarianPeaceKeepingOperation,
              "contractfinancing": docs[i].contractFinancing,
              "costorpricingdata": docs[i].costOrPricingData,
              "costaccountingstandardsclause": docs[i].costAccountingStandardsClause,
              "descriptionofcontractrequirement": docs[i].descriptionOfContractRequirement,
              "purchasecardaspaymentmethod": docs[i].purchaseCardAsPaymentMethod,
              "numberofactions": docs[i].numberOfActions,
              "nationalinterestactioncode": docs[i].nationalInterestActionCode,
              "progsourceagency": docs[i].ProgSourceAgency,
              "progsourceaccount": docs[i].ProgSourceAccount,
              "progsourcesubacct": docs[i].ProgSourceSubacct,
              "vendoralternatename": docs[i].vendorAlternateName,
              "vendorlegalorganizationname": docs[i].vendorLegalOrganizationName,
              "streetaddress": docs[i].streetAddress,
              "city": docs[i].city,
              "state": docs[i].state,
              "zipcode": docs[i].ZIPCode,
              "vendorcountrycode": docs[i].vendorCountryCode,
              "vendor_state_code": docs[i].vendorStateCode,
              "congressionaldistrict": docs[i].congressionalDistrict,
              "vendorsitecode": docs[i].vendorSiteCode,
              "vendoralternatesitecode": docs[i].vendorAlternateSiteCode,
              "dunsnumber": docs[i].DUNSNumber,
              "parentdunsnumber": docs[i].parentDUNSNumber,
              "registrationdate": docs[i].registrationDate,
              "renewaldate": docs[i].renewalDate,
              "mod_parent": docs[i].mod_parent,
              "statecode": docs[i].stateCode,
              "placeofperformancecity": docs[i].placeOfPerformanceCity,
              "pop_state_code": docs[i].popStateCode,
              "placeofperformancecountrycode": docs[i].placeOfPerformanceCountryCode,
              "placeofperformancezipcode": docs[i].placeOfPerformanceZIPCode,
              "pop_cd": docs[i].pop_cd,
              "psc_cat": docs[i].psc_cat,
              "productorservicecode": docs[i].productOrServiceCode,
              "principalnaicscode": docs[i].principalNAICSCode,
              "gfe_gfp": docs[i].GFE_GFP,
              "agencyid": docs[i].agencyID,
              "fiscal_year": docs[i].fiscal_year,
              "extentcompeted": docs[i].extentCompeted,
              "typeofsetaside": docs[i].typeOfSetAside
            })
          }
        } else {
          console.log(resp);
        }



        table.appendRows(tableData);
        doneCallback();
    	}
    });
  };

  tableau.registerConnector(myConnector);

  // Create event listeners for when the user submits the form
  $(document).ready(function() {
      $("#submitButton").click(function() {
          // Grab values from pulldowns for API url
          fiscalYear = $('#FiscalYearSelected').val() || fiscalYear;
          majAgencyCat = $('#Agency').val() || majAgencyCat;
          maxRecords = $('#MaxRecords').val() || MaxRecords;

          tableau.connectionName = "Contracts from USASpending API"; // This will be the data source name in Tableau
          tableau.submit(); // This sends the connector object to Tableau
      });
  });
})();

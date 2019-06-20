// ==UserScript==
// @name         One Confluence No Format Macro Selector
// @namespace    https://github.com/skaveesh/One-Confluence-No-Format-Macro-Selector/
// @version      1.3
// @description  One Confluence No Format Macro Selector for Pearson
// @author       Samintha Kaveesh
// @run-at       document-idle
// @match        https://one-confluence.pearson.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// ==/UserScript==

//////////////////////below code is waitForKeyElements
//////////////////////detects and handles AJAXed content.
//////////////////////https://gist.githubusercontent.com/BrockA/2625891/raw/9c97aa67ff9c5d56be34a55ad6c18a314e5eb548/waitForKeyElements.js
function waitForKeyElements ( selectorTxt, actionFunction, bWaitOnce, iframeSelector ) { var targetNodes, btargetsFound; if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt); else targetNodes = $(iframeSelector).contents () .find (selectorTxt); if (targetNodes && targetNodes.length > 0) { btargetsFound = true; targetNodes.each ( function () { var jThis = $(this); var alreadyFound = jThis.data ('alreadyFound') || false; if (!alreadyFound) { var cancelFound = actionFunction (jThis); if (cancelFound) btargetsFound = false; else jThis.data ('alreadyFound', true); } } ); } else { btargetsFound = false; } var controlObj = waitForKeyElements.controlObj || {}; var controlKey = selectorTxt.replace (/[^\w]/g, "_"); var timeControl = controlObj [controlKey]; if (btargetsFound && bWaitOnce && timeControl) { clearInterval (timeControl); delete controlObj [controlKey]; } else { if ( ! timeControl) { timeControl = setInterval ( function () { waitForKeyElements ( selectorTxt, actionFunction, bWaitOnce, iframeSelector ); }, 300 ); controlObj [controlKey] = timeControl; } } waitForKeyElements.controlObj = controlObj; }

var executedOnce = false;

$(document).ready(function() {

    //waiting for ajax to (when document load vB_Editor_QR_iframe)
    waitForKeyElements (".preformattedContent", loadElementsAfterLoadingInnerDoc);

    function loadElementsAfterLoadingInnerDoc(){

        (function(){

            'use strict';

            if(!executedOnce){

                var preParentElement = document.getElementsByClassName("preformatted panel");

                for (var i = 0; i < preParentElement.length; ++i) {

                    var item = preParentElement[i];
                    item.insertAdjacentHTML("beforebegin", "<button id='selectButton_"+i+"' >Copy to Clipboard</button>");

                    var preElement = preParentElement[i].childNodes;
                    preElement[0].setAttribute("id", "preElement_"+i);

                    (function(i) {

                        document.getElementById ("selectButton_"+i).addEventListener("click", function() {

                            var range = document.createRange();
                            var selection = window.getSelection();
                            var valueToBeCopied = document.getElementById("preElement_"+i);

                            range.selectNodeContents(valueToBeCopied);

                            selection.removeAllRanges();
                            selection.addRange(range);

                            //copy to clipboard
                            document.execCommand('copy');

                        })
                        
                    })(i);
                }

                executedOnce = true;
            }

        })();
    }

});

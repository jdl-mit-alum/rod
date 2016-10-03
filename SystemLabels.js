/** Description of SystemLabels
 *
 * @author: Jonathan D. Lettvin
 * @version: 1.1
 * @return: undefined
 *
 * Date: 20160812 to 20160817
 * Goal: swap custom system labels for terms (default system labels).
 * Expect label dictionary as query string parameters.
 * This code supports display of custom labels in place of terms.
 * PBI #594114 - Online Help to Honor System Labels
 * Because this uses jQuery, it can be loaded anywhere in the HTML
 * Example: <script src="static/SystemLabels.js"></script>
 * It can also be loaded by other javascript loading mechanism such as steal.
 *
 * This code depends on existence of a translation dictionary,
 * It is parsed from the original URL, updated, and retained per session.
 * Translations begin from Vision source code:
 * \Development\Storm\code\client\DeltekNavigator\Web\src\core\control\helpers\
 *   formatting.js
 *      Currently the dictionary has terms like "[vendor]" and
 *      Help uses keywords resembling "COMPANYSWAP".
 *
 * After a document is finished loading and ready for operations
 * this code connects a variety of events to a local function
 * which implements the swapping of terms for system labels.
 * The HTML is expected to have tags with this appearance:
 *   <dfn class="term" id="$2">$1</dfn>
 * where $1 is the default label
 * and $2 is the key for searching in global.format.systemLabels
 * where an existing value is swapped into the place of $1.
 *
 * Working example:
 *   http://localhost:3000/Synonym_Topic_1.html?COMPANYSWAP=organization
 */

jQuery.extend({
  getQueryParameters : function(str) {
      // https://css-tricks.com/snippets/jquery/get-query-params-object/
	  return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
  }
});

$(document).ready(function() {

    var thePrefix = "StormSystemLabel:";

    var getSystemLabels = function() {
        var theSource = $.getQueryParameters();

        if (theSource) {
           $.each(theSource, function(aKey, aVal) {
               sessionStorage.setItem(thePrefix + aKey, aVal);
           });
        }
    };

    var swapLabels = function() {
        getSystemLabels();

        var theElementAt = document.getElementsByTagName("dfn");

        for (var index =0; index < theElementAt.length; index++) {
            // For each index into the list of elements
            var theElement = theElementAt[index];
            try {
                // extract relevant parts from <dfn> tag.
                var theClass = theElement.getAttribute("class");
                var theId = theElement.getAttribute("id");
                if (theClass && theClass === "term" && theId) {
                    // Fetch new system label from the systemLabels dictionary.
                    var theLabel = sessionStorage.getItem(thePrefix + theId);
                    // Replace <dfn> tagged text with the fetched system label.
                    if (theClass && theClass === "term" && theLabel) {
                        theElement.innerHTML = theLabel;
                    }
                }
            }
            catch (theException) { /* leave the existing text intact */ }
        }
    };

    // Run the swap at least once when ready.
    swapLabels();

    // Run timed interval swap to pickup on event absence.
    setInterval(swapLabels, 300);

    // Attach the above defined function to a variety of events.
    // It may be prudent to add more events to this list
    // if systems are found which fail to swap in the new system labels.
    $(document).on({
        load: swapLabels
        ,mousemove: swapLabels
    },
    document);
});

/*
  Alan's Analytics Tracking jQuery Plugin
  Created: 5 March 2014
  Last updated: See GIT/SVN
  Author: Alan Koeninger
  ----------------------------------
*/


  // VALIDATION SETTINGS FOR JSHINT.COM

  // This file
  /*jshint browser:true, jquery:true, strict:true, devel:true, smarttabs:true */





(function($) {
  /*jshint browser:true, jquery:true, strict:true, devel:true, smarttabs:true */
    "use strict";

  /* -------------------------------------
    GOOGLE ANALYTICS TRACKING HELPER
    -------------------------------------

    Use this plugin when you want to track an event, social links, custom variables or virtual
    pageviews via Google Analytics. It is cocmpatible with Classic (ga.js) and Universal (analaytics.js).
    It is NOT yet compatible with Google Tag Manager.

    There are two ways to use this plugin.

    ------------

    1. Embedding the GA tracking data into the HTML (eg. via the CMS)

        Examples:
        Event tracking
        <a href="#" data-googletrackevent="1" data-category="X campaign" data-action="Carousel link" data-label="Banner no.3" data-value="1">Banner</a>

            data-googletrackevent="1" (this turns it on)
            data-category is required
            data-action is required
            data-label is optional
            data-value is optional

        Social media example:
        <a href="#" data-googletracksocial="1" data-socialnetwork="Facebook" data-socialaction="Like" data-socialtarget="Homepage" data-socialpagepath="http://www.chrometoaster.com">Facebook</a>

            data-googletracksocial="1" (this turns it on)
            data-socialnetwork is required
            data-socialaction is required
            data-socialtarget is optional
            data-socialpagepath is optional

        Custom variables
        <a href="#" data-googletrackcustom="1" data-customindex="1" data-customname="Gender" data-customvalue="male" data-customscope="1">Custom</a>

            data-googletrackcustom="1" (this turns it on)
            data-customindex is required
            data-customname is required
            data-customvalue is required
            data-customscope is optional

        Virtual pageviews
        <a href="link.html" data-googletrackpage="1" data-pagelink="link.html">Link</a>

            data-googletrackpage="1" (this turns it on)
            data-pagelink is required


        Funnel/Goal tracking (only works for <a>'s)
        <a href="#" data-googletrackfunnel="1" data-funnelname="call-to-action" data-funnelvalue="yes">Banner</a>

            data-googletrackfunnel="1" (this turns it on)
            data-funnelname is required
            data-funnelvalue is optional

            This will append to the link URL a querystring like this: ?call-to-action=yes&from=page-url

        You can also combine them:
      <a href="#" data-googletrackevent="1" data-googletracksocial="1" data-action="Tweet" data-category="Social" data-socialnetwork="Twitter" data-socialaction="Tweet" data-socialtarget="This is the page title" data-socialpagepath="http://www.chrometoaster.com">Twitter</a>

        Note: the click event is automatically
        captured on page load

    ------------

    2. Adding the GA tracking data into the plugin options directly

        Event example:
            $(this).gahelper({
              'category': 'X campaign',
              'action': 'Carousel link',
              'label': 'Banner no.3',
              'value': 1
            });

        Note: if using the no.2 method described above, the browser generated event is not part
        of this helper. You need to call it from within the event, for example:
            $('input:radio').click(function() {
                $(this).gahelper({...});
            });

    -----------------------------------------
    OPTIONS & REQUIREMENTS
    -----------------------------------------

    EVENT TRACKING OPTIONS:
    Docs: http://code.google.com/apis/analytics/docs/tracking/eventTrackerGuide.html
    Event tracking requires these options to be set:

        - category (string, required)
        The name you supply for the group of objects you want to track
        - action (string, required)
        A string that is uniquely paired with each category, and commonly used to define the type of user interaction for the web object.
        - label (string, optional)
        An optional string to provide additional dimensions to the event data.
        - value (integer, optional)
        An integer that you can use to provide numerical data about the user event.


    SOCIAL TRACKING OPTIONS:
    Docs: http://code.google.com/apis/analytics/docs/tracking/gaTrackingSocial.html
    Social tracking requires these options to be set:

        - socialnetwork (string, required)
        Representing the social network being tracked (e.g. Facebook, Twitter, LinkedIn)
        - socialaction (string, required)
        Representing the social action being tracked (e.g. Like, Share, Tweet)
        - socialtarget (string, optional)
        Representing the URL (or resource) which receives the action. For example, if a user clicks the Like button on a page on a site, the the opt_target might be set to the title of the page, or an ID used to identify the page in a content management system. In many cases, the page you Like is the same page you are on. So if this parameter is undefined, or omitted, the tracking code defaults to using document.location.href.
        - socialpagepath (string, optional)
        Representing the page by path (including parameters) from which the action occurred. For example, if you click a Like button on http://code.google.com/apis/analytics/docs/index.html, then opt_pagePath should be set to /apis/analytics/docs/index.html. Almost always, the path of the page is the source of the social action. So if this parameter is undefined or omitted, the tracking code defaults to using location.pathname plus location.search. You generally only need to set this if you are tracking virtual pageviews by modifying the optional page path parameter with the Google Analytics pageview method.


    CUSTOM VARIABLES TRACKING OPTIONS:
    Docs: http://code.google.com/apis/analytics/docs/tracking/gaTrackingCustomVariables.html
    Custom variables tracking requires these options to be set:

        - customindex (integer, required)
        The slot for the custom variable. This is a number whose value can range from 1 - 5, inclusive. A custom variable should be placed in one slot only and not be re-used across different slots.
        - customname (string, required)
        The name for the custom variable. This is a string that identifies the custom variable and appears in the top-level Custom Variables report of the Analytics reports.
        - customvalue (string, required)
        The value for the custom variable. This is a string that is paired with a name. You can pair a number of values with a custom variable name. The value appears in the table list of the UI for a selected variable name. Typically, you will have two or more values for a given name. For example, you might define a custom variable name gender and supply male and female as two possible values.
        - customscope (integer, optional)
        The scope for the custom variable. As described above, the scope defines the level of user engagement with your site. It is a number whose possible values are 1 (visitor-level), 2 (session-level), or 3 (page-level). When left undefined, the custom variable scope defaults to page-level interaction.
    
    Note that custom variables require events to be sent as well, however this script will automatically send them, so you don't need to send an event yourself.

    VIRTUAL PAGEVIEWS TRACKING OPTIONS:
    Docs: http://code.google.com/apis/analytics/docs/tracking/asyncMigrationExamples.html#VirtualPageviews
    Custom variables tracking requires these options to be set:

        - pagelink (string, required)
        The URL of the page being linked to - can be the same as the href attribute.


    FUNNELING
    If you need to automate the task of adding funneling links to existing links,
    please add them into the ga_helper_init() function, by calling the JS directly (ie using the second method).

    ---------------------------------- */
    var gaq_snippet = false, // GA classic
        ga_snippet = false; // GA universal
    

    // Watch for elements that are marked for tracking on page load
    var ga_helper_init = function() {

      /* ----------------------------------
        Begin editable stuff
        ---------------------------------- */
      
      
      // GA - track outbound links
      $('a[href^=http]').on('click', function() {
         var link_url = '';
         link_url = $(this).attr('href');
         // Only process if link is different from hostname 
         if ($(this).prop('hostname') !== window.location.host) {
           $(this).gahelper({
             'category': 'Outbound links',
             'action': 'Click',
             'label': encodeURI(link_url)
           });
         }
      });
      
      // GA - track mailto & tel links
      $('a[href^=mailto],a[href^=tel]').on('click', function() {
         var link_url = '';
         link_url = $(this).attr('href');
         $(this).gahelper({
           'category': 'Email/tel links',
           'action': 'Click',
           'label': encodeURI(link_url)
         });
      });
      
      

            


      // End of editable area




    };

    $(document).ready(function() {
  
        // Check for the different types of GA code
        if (typeof ga !== 'undefined') {
          ga_snippet = true;
        }
        if (typeof _gaq !== 'undefined') {
          gaq_snippet = true;
        }
  
        // Start the GA tracking helper
        $('*[data-googletrackevent], *[data-googletracksocial], *[data-googletrackcustom], *[data-googletrackpage], a[data-googletrackfunnel]').bind('click', function() {
          $(this).gahelper();
        });
        ga_helper_init();
        
    });

    $.fn.gahelper = function(options) {

      // Options
      options = $.extend({
          // Event
          category: '',
          action: '',
          label: '',
          value: null,
          // Social
          socialnetwork: '',
          socialaction: '',
          socialtarget: '',
          socialpagepath: '',
          customindex: '',
          customname: '',
          customvalue: '',
          customscope: '',
          // Pageviews
          pagelink: '',
          // Funnels
          funnelname: false,
          funnelvalue: ''
      }, options);

      // Check for GA
      
      if (ga_snippet || gaq_snippet) { 

        return this.each(function() {
          // set variables
          var element = $(this),
              ga_category = '',
              ga_action = '',
              ga_label = '',
              ga_value = null,
              ga_socialnetwork = '',
              ga_socialaction = '',
              ga_socialtarget = '',
              ga_socialpagepath = '',
              ga_customindex = '',
              ga_customname = '',
              ga_customvalue = '',
              ga_customscope = '',
              ga_pagelink = '';

          if ((element.attr('data-googletrackevent') === '1') || (element.attr('data-googletracksocial') === '1') || (element.attr('data-googletrackcustom') === '1') || (element.attr('data-googletrackpage') === '1')) {

            // Get the data attributes
            var ga_data = element.data();

            // If the Custom variables GA tracking data is being passed via the HTML
            if (element.attr('data-googletrackcustom') === '1') {
              // Check for the 'required' GA options
              if (element.has('[data-customindex]') && element.has('[data-customname]') && element.has('[data-customvalue]')) {

                  // Check integers
                  if (ga_methods.is_int(ga_data.customindex)) {
                    ga_customindex = parseInt(ga_data.customindex, 10);
                    ga_customname = ga_data.customname;
                    ga_customvalue = ga_data.customvalue;
                    if (ga_data.customscope) {
                      if (ga_methods.is_int(ga_data.customscope)) {
                        ga_customscope = parseInt(ga_data.customscope, 10);
                      }
                    }
                  }
                  // Push the data to Google
                  if (gaq_snippet) {
                     _gaq.push(['_setCustomVar', ga_customindex, ga_customname, ga_customvalue, ga_customscope]);
                  }
                  if (ga_snippet) {
                    ga('set', 'dimension'+ga_customindex, ga_customvalue);
                  }
                  //console.log('_setCustomVar', ga_customindex, ga_customname, ga_customvalue, ga_customscope);
                  // Check for a trackevent, which is required for custom variables. If missing, we will auto generate
                  if (element.attr('data-googletrackevent') !== '1') {
                    if (gaq_snippet) {
                      _gaq.push(['_trackEvent', 'Custom variables', ga_customname, ga_customvalue]);
                    }
                    if (ga_snippet) {
                      ga('send', 'event', 'Custom variables', ga_customname, ga_customvalue);
                    }
                    //console.log('_trackEvent', 'Custom variables', ga_customname, ga_customvalue);
                  }
              }
            }

            // If the Event GA tracking data is being passed via the HTML
            if (element.attr('data-googletrackevent') === '1') {
              // Check for the 'required' GA options
              if (element.has('[data-category]') && element.has('[data-action]')) {

                  ga_category = ga_data.category;
                  ga_action = ga_data.action;
                  if (ga_data.label) {
                    ga_label = ga_data.label;
                  }
                  if (ga_data.value !== null) {
                    // must be an integer
                    if (ga_methods.is_int(ga_data.value)) {
                      ga_value = parseInt(ga_data.value, 10);
                    }
                  }
                  // Push the data to Google
                   if (gaq_snippet) {
                     _gaq.push(['_trackEvent', ga_category, ga_action, ga_label, ga_value]);
                   }
                   if (ga_snippet) {
                     ga('send', 'event', ga_category, ga_action, ga_label, ga_value);
                   }
                  //console.log('_trackEvent', ga_category, ga_action, ga_label, ga_value);

              }
            }

            // If the Social GA tracking data is being passed via the HTML
            if (element.attr('data-googletracksocial') === '1') {
              // Check for the 'required' GA options
              if (element.has('[data-socialnetwork]') && element.has('[data-socialaction]')) {

                  ga_socialnetwork = ga_data.socialnetwork;
                  ga_socialaction = ga_data.socialaction;
                  if (ga_data.socialtarget) {
                    ga_socialtarget = ga_data.socialtarget;
                  }
                  if (ga_data.socialpagepath) {
                    ga_socialpagepath = ga_data.socialpagepath;
                  }
                  // Push the data to Google
                   if (gaq_snippet) {
                     _gaq.push(['_trackSocial', ga_socialnetwork, ga_socialaction, ga_socialtarget, ga_socialpagepath]);
                   }
                   if (ga_snippet) {
                     ga('send', 'social', ga_socialnetwork, ga_socialaction, ga_socialtarget, {'page': ga_socialpagepath});
                   }
                  //console.log('_trackSocial', ga_socialnetwork, ga_socialaction, ga_socialtarget, ga_socialpagepath);

              }
            }

            // If the Virtual pageviews GA tracking data is being passed via the HTML
            if (element.attr('data-googletrackpage') === '1') {
              // Check for the 'required' GA options
              if (element.has('[data-pagelink]')) {
                  ga_pagelink = ga_data.pagelink;
                  // Push the data to Google
                   if (gaq_snippet) {
                     _gaq.push(['_trackPageview', ga_pagelink]);
                   }
                   if (ga_snippet) {
                     ga('send', 'pageview', ga_pagelink);
                   }
                  //console.log('_trackPageview', ga_pagelink);
              }
            }


          // Else it's being passed directly via the object param
          } else {
            
            // Check for the 'required' Custom GA options
            if ((options.customindex !== '' && options.customname !== '' && options.customvalue !== '') && (element.attr('data-googletrackcustom') !== '1')) {
              // Push the data to Google
              // Check integers
              if (ga_methods.is_int(options.customindex)) {
                ga_customindex = parseInt(options.customindex, 10);
                if (ga_methods.is_int(options.customscope)) {
                  ga_customscope = parseInt(options.customscope, 10);
                }
                 if (gaq_snippet) {
                   _gaq.push(['_setCustomVar', options.customindex, options.customname, options.customvalue, options.customscope]);
                 }
                 if (ga_snippet) {
                   ga('set', 'dimension'+options.customindex, options.customvalue);
                 }
                //console.log('_setCustomVar', options.customindex, options.customname, options.customvalue, options.customscope);
                // Check for a trackevent, which is required for custom variables. If missing, we will auto generate
                if (options.category === '' && options.action === '') {
                   if (gaq_snippet) {
                     _gaq.push(['_trackEvent', 'Custom variables', options.customname, options.customvalue]);
                   }
                   if (ga_snippet) {
                     ga('send', 'event', 'Custom variables', options.customname, options.customvalue);
                   }
                  //console.log('_trackEvent', 'Custom variables', options.customname, options.customvalue);
                }
              }
            }


  
            // Check for the 'required' Event GA options
            if ((options.category !== '' && options.action !== '') && (element.attr('data-googletrackevent') !== '1')) {
              if (options.value !== null) {
                  // Check integers
                  if (ga_methods.is_int(options.value)) {
                    ga_value = parseInt(options.value, 10);
                  }
                }
              // Push the data to Google
               if (gaq_snippet) {
                 _gaq.push(['_trackEvent',options.category, options.action, options.label, options.value]);
               }
               if (ga_snippet) {
                 ga('send', 'event', options.category, options.action, options.label, options.value);
               }           
               //console.log('_trackEvent', options.category, options.action, options.label, options.value);
            }


            // Check for the 'required' Social GA options
            if ((options.socialnetwork !== '' && options.socialaction !== '') && (element.attr('data-googletracksocial') !== '1')) {
              // Push the data to Google
               if (gaq_snippet) {
                 _gaq.push(['_trackSocial', options.socialnetwork, options.socialaction, options.socialtarget, options.socialpagepath]);
               }
               if (ga_snippet) {
                 ga('send', 'social', options.socialnetwork, options.socialaction, options.socialtarget, {'page': options.socialpagepath});
               }
              //console.log('_trackSocial', options.socialnetwork, options.socialaction, options.socialtarget, options.socialpagepath);
            }


            // Check for the 'required' Pageviews GA options
            if ((options.pagelink !== '') && (element.attr('data-googletrackpage') !== '1')) {
              // Push the data to Google
               if (gaq_snippet) {
                 _gaq.push(['_trackPageview', options.pagelink]);
               }
               if (ga_snippet) {
                 ga('send', 'pageview', options.pagelink);
               }
              //console.log('_trackPageview '+ options.pagelink);
            }



          }

          /* Google Analytics Funnel support */
          /* The purpose of this is to amend the URL of a link so that Google can track funneling. */
          if (((element.attr('data-googletrackfunnel') === '1') && (element.attr('data-funnelname') !== '')) || (options.funnelname)) {
            // don't trigger this twice if accidently included using both methods
            if ((options.funnelname || (options.pagelink !== '') || (options.socialnetwork !== '') || (options.category !== '') || (options.customindex !== '')) && element.attr('data-googletrackfunnel') === '1') {
              return;
            }
            // If it's a link
            if (element.is('a')) {
              var newhref = element.attr('href');
              var pageurl = window.location.pathname;
              var url_portion_1 = ga_methods.return_url_portion(pageurl, 1);
              var url_portion_2 = ga_methods.return_url_portion(pageurl, 2);
              var pathname = url_portion_1;
              if (url_portion_2) {
                pathname = url_portion_1 + '/' + url_portion_2;
              } 
              var ga_funnelname = '';
              var ga_funnelvalue = '';
              ga_funnelname = element.attr('id');
              if (!options.funnelname) {
                ga_funnelname = encodeURI(element.attr('data-funnelname'));
                ga_funnelvalue = encodeURI(element.attr('data-funnelvalue'));
              } else {
                ga_funnelname = encodeURI(options.funnelname);
                ga_funnelvalue = encodeURI(options.funnelvalue);
              }
              if (ga_funnelvalue === '') {
                ga_funnelvalue = 1;
              }
              var funnelurl = ga_funnelname + '=' + ga_funnelvalue + '&from=/'+ pathname;
              // Append title & funnel
              newhref = ga_methods.validate_url(newhref, funnelurl);
              // Update the link URL
              element.attr('href', newhref);
            }
          }
          
        });

      }
    };

    var ga_methods = {

      // The 'value' option must be an integer and requires this check to avoid errors
      is_int: function(value) {
        if((parseFloat(value) === parseInt(value, 10)) && !isNaN(value)){
            return true;
        } else {
            return false;
        }
      },

      // This function returns a portion of a URL path
      return_url_portion: function(url,portion) {
        if (url && portion) {
          if (ga_methods.is_int(portion)) {
            var url_array, url_array_2;
            // Check for existing querystring
            url_array = url.split('?');
            if (url_array.length > 1) {
              url_array_2 = url_array[0];
            } else {
              url_array_2 = url;
            }
            url_array = url_array_2.split('/');
            return url_array[portion];
          }
        }
      },

      // This function prepares a URL for funneling.
      validate_url: function(href, funnelurl) {

        var hash = '',
            url_array = '',
            urlprefix = href,
            querystring_delimeter = '?',
            querystring_separator = '&';

        url_array = href.split('#');

        if (url_array.length > 1) {
          hash = '#' + url_array[url_array.length-1];
          urlprefix = url_array[0];
        }
        // Check for a '?'
        if (urlprefix.indexOf('?') >= 1) {
          querystring_delimeter = '';
          // Check for an '&'
          if (urlprefix.substring(urlprefix.length-1) !== "&") {
            urlprefix = urlprefix + querystring_separator;
          }
        }

        var url = urlprefix + querystring_delimeter + funnelurl + hash;
        return url;

      },

      get_extension_for_ga: function(filename) {
        return filename.split('.').pop().toLowerCase();
      }

    };




})(jQuery);
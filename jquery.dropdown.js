/*
 * jQuery dropdown: A simple dropdown plugin
 *
 * Forked from https://github.com/claviska/jquery-dropdown.git
 *
 */
if (jQuery) {(function ($) {

  'use strict';

  var Dropdown = {
    show: function (event) {

      var trigger = $(this),
        dropdown = $(trigger.attr('data-dropdown')),
        isOpen = trigger.hasClass('dropdown-open');

      // In some cases we don't want to show it
      if ($(event.target).hasClass('dropdown-ignore')) {return; }

      event.preventDefault();
      event.stopPropagation();
      Dropdown.hide();

      if (isOpen || trigger.hasClass('dropdown-disabled')) {return; }

      // Show it
      trigger.addClass('dropdown-open');
      dropdown
        .data('dropdown-trigger', trigger)
        .show();

      // Position it
      Dropdown.position();

      // Trigger the show callback
      dropdown
        .trigger('show', {
          dropdown: dropdown,
          trigger: trigger
        });

      return trigger;
    },

    hide: function (event) {

      // In some cases we don't hide them
      var targetGroup = event ? $(event.target).parents().addBack() : null;

      // Are we clicking anywhere in a dropdown?
      if (targetGroup && targetGroup.is('.dropdown')) {
        // Is it a dropdown menu?
        if (targetGroup.is('.dropdown-menu')) {
          // Did we click on an option? If so close it.
          if (!targetGroup.is('A')) {return; }
        } else {
          // Nope, it's a panel. Leave it open.
          return;
        }
      }

      // Hide any dropdown that may be showing
      $(document).find('.dropdown:visible').each(function () {
        var dropdown = $(this);
        dropdown
          .hide()
          .removeData('dropdown-trigger')
          .trigger('hide', { dropdown: dropdown });
      });

      // Remove all dropdown-open classes
      $(document).find('.dropdown-open').removeClass('dropdown-open');

      return $(this);
    },

    position: function () {
      var dropdown = $('.dropdown:visible').eq(0),
        trigger = dropdown.data('dropdown-trigger'),
        hOffset = trigger ? parseInt(trigger.attr('data-horizontal-offset') || 0, 10) : null,
        vOffset = trigger ? parseInt(trigger.attr('data-vertical-offset') || 0, 10) : null;

      if (dropdown.length === 0 || !trigger) {return; }

      // Position the dropdown relative-to-parent...
      if (dropdown.hasClass('dropdown-relative')) {
        dropdown.css({
          left: dropdown.hasClass('dropdown-anchor-right') ?
              trigger.position().left - (dropdown.outerWidth(true) - trigger.outerWidth(true)) - parseInt(trigger.css('margin-right'), 10) + hOffset :
              trigger.position().left + parseInt(trigger.css('margin-left'), 10) + hOffset,
          top: trigger.position().top + trigger.outerHeight(true) - parseInt(trigger.css('margin-top'), 10) + vOffset
        });
      } else {
        // ...or relative to document
        dropdown.css({
          left: dropdown.hasClass('dropdown-anchor-right') ?
              trigger.offset().left - (dropdown.outerWidth() - trigger.outerWidth()) + hOffset : trigger.offset().left + hOffset,
          top: trigger.offset().top + trigger.outerHeight() + vOffset
        });
      }
    },

    attach: function (data) {
      return $(this).attr('data-dropdown', data);
    },
    detach: function () {
      Dropdown.hide();
      return $(this).removeAttr('data-dropdown');
    },
    enable: function () {
      Dropdown.hide();
      return $(this).removeClass('dropdown-disabled');
    },
    disable: function () {
      return $(this).addClass('dropdown-disabled');
    },
  };

  $.extend($.fn, {
    dropdown: function (method, data) {Dropdown[method].call(this, data); }
  });

  $(document).on('click.dropdown', '[data-dropdown]', Dropdown.show);
  $(document).on('click.dropdown', Dropdown.hide);
  $(window).on('resize', Dropdown.position);

}(jQuery));
  }

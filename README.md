BBox - npm `b-box`
==================

Border-box geometric information for the DOM element of HTML5.

Constructor
-----------

* BBox(element)

Fields
------

* `top`
* `left`
* `right`
* `bottom`
* `width`
* `height`
* {`margin-`|`padding-`|`border-`}{`top`|`left`|`right`|`bottom`}

A Type of these fields above are _string_ that have `px` at the tail.
To retrieve a number, use `px` method.

Methods
-------

* `update`() - Updates the fields by evaluating the computed style of the
  element specified at the constructor.
* `px`(`<field-name>`) - Returns a number value of the field.
* `margin{Top|Left|Right|Bottom|Nc`() - Returns a total margin length as a
  number.
* `marginHorizontalNc`() - Returns a `marginLeftNc()+marginRightNc`.
* `marginVerticalNc`() - Returns a `marginTopNc()+marginBottomNc`.


LICENSE
-------

This software is released under the MIT License, see [LICENSE](LICENSE)

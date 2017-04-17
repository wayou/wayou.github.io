# iron-elements

Basic building blocks for creating an application.

## Roadmap

### Elements in progress

* `iron-list` - the upgraded version of a virtualized infinite list, previously named `core-list`. ETA: Couple weeks.

### Elements planned
_Elements we're planning on building soon but haven't started yet_

[Currently focused on getting all elements up to speed]

### Elements not planned, notably
_Elements we're not planning on building as part of this product line, but that one might be wondering about_

A number of elements existed as `core` elements that are not in this product line:
* `core-action-icons` - This wasn't really an element, and wasn't particularly heavily used.
* `core-animation` - The animation-related elements that were part of core will be created as part of the `neon` product line.
* `core-docs` - Deprecated: use [`iron-doc-viewer`](https://github.com/polymerelements/iron-doc-viewer).
* `core-drag-drop` - Not currently working on.
* `core-dropdown` and `core-dropdown-menu` - These were confusing UI to have in `core`, so we've moved them to the `paper` element set for now and made them easier to customize. More on the thought process behind this change in the [blog](https://blog.polymer-project.org/announcements/2015/05/14/updated-elements/).
* `core-focusable` - This has been re-implemented using Polymer behaviors - see for example the `paper-radio-button-behavior` in [`paper-behaviors`](https://github.com/PolymerElements/paper-behaviors).
* `core-item` - This had UI opinion, so was re-implemented as [`paper-item`](https://github.com/polymerelements/paper-item).
* `core-layout` - We're working on more stable, consistent layout elements.
* `core-overlay` - This is re-implemented as a behavior, in [`iron-overlay-behavior`](https://github.com/polymerelements/iron-overlay-behavior).
* `core-popup-menu` - This element wasn't particularly of unique value, so we're putting it away for now.
* `core-scroll-header-panel` - This had UI opinion, so it's been moved to [`paper-scroll-header-panel`](https://github.com/polymerelements/paper-scroll-header-panel).
* `core-splitter` - This element was relatively trivial, so we've put it off for now.
* `core-style` - This element is not useful with Polymer's new styling system. Check out the latest docs for more.
* `core-tooltip` - This will become `paper-tooltip`.
* `core-menu` - This had UI opinion, and will become `paper-dropdown-menu`.

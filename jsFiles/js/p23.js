var wpNavMenu;

(function($) {

	var api = wpNavMenu = {

		options : {
			menuItemDepthPerLevel : 30, // Do not use directly. Use depthToPx and pxToDepth instead.
			globalMaxDepth : 11
		},

		menuList : undefined,	// Set in init.
		targetList : undefined, // Set in init.
		menusChanged : false,
		isRTL: !! ( 'undefined' != typeof isRtl && isRtl ),
		negateIfRTL: ( 'undefined' != typeof isRtl && isRtl ) ? -1 : 1,

		// Functions that run on init.
		init : function() {
			api.menuList = $('#menu-to-edit');
			api.targetList = api.menuList;

			this.jQueryExtensions();

			this.attachMenuEditListeners();

			this.setupInputWithDefaultTitle();
			this.attachQuickSearchListeners();
			this.attachThemeLocationsListeners();

			this.attachTabsPanelListeners();

			this.attachUnsavedChangesListener();

			if( api.menuList.length ) // If no menu, we're in the + tab.
				this.initSortables();

			this.initToggles();

			this.initTabManager();
		},

		jQueryExtensions : function() {
			// jQuery extensions
			$.fn.extend({
				menuItemDepth : function() {
					var margin = api.isRTL ? this.eq(0).css('margin-right') : this.eq(0).css('margin-left');
					return api.pxToDepth( margin && -1 != margin.indexOf('px') ? margin.slice(0, -2) : 0 );
				},
				updateDepthClass : function(current, prev) {
					return this.each(function(){
						var t = $(this);
						prev = prev || t.menuItemDepth();
						$(this).removeClass('menu-item-depth-'+ prev )
							.addClass('menu-item-depth-'+ current );
					});
				},
				shiftDepthClass : function(change) {
					return this.each(function(){
						var t = $(this),
							depth = t.menuItemDepth();
						$(this).removeClass('menu-item-depth-'+ depth )
							.addClass('menu-item-depth-'+ (depth + change) );
					});
				},
				childMenuItems : function() {
					var result = $();
					this.each(function(){
						var t = $(this), depth = t.menuItemDepth(), next = t.next();
						while( next.length && next.menuItemDepth() > depth ) {
							result = result.add( next );
							next = next.next();
						}
					});
					return result;
				},
				updateParentMenuItemDBId : function() {
					return this.each(function(){
						var item = $(this),
							input = item.find('.menu-item-data-parent-id'),
							depth = item.menuItemDepth(),
							parent = item.prev();

						if( depth == 0 ) { // Item is on the top level, has no parent
							input.val(0);
						} else { // Find the parent item, and retrieve its object id.
							while( ! parent[0] || ! parent[0].className || -1 == parent[0].className.indexOf('menu-item') || ( parent.menuItemDepth() != depth - 1 ) )
								parent = parent.prev();
							input.val( parent.find('.menu-item-data-db-id').val() );
						}
					});
				},
				hideAdvancedMenuItemFields : function() {
					return this.each(function(){
						var that = $(this);
						$('.hide-column-tog').not(':checked').each(function(){
							that.find('.field-' + $(this).val() ).addClass('hidden-field');
						});
					});
				},
				/**
				 * Adds selected menu items to the menu.
				 *
				 * @param jQuery metabox The metabox jQuery object.
				 */
				addSelectedToMenu : function(processMethod) {
					if ( 0 == $('#menu-to-edit').length ) {
						return false;
					}

					return this.each(function() {
						var t = $(this), menuItems = {},
							checkboxes = t.find('.tabs-panel-active .categorychecklist li input:checked'),
							re = new RegExp('menu-item\\[(\[^\\]\]*)');

						processMethod = processMethod || api.addMenuItemToBottom;

						// If no items are checked, bail.
						if ( !checkboxes.length )
							return false;

						// Show the ajax spinner
						t.find('img.waiting').show();

						// Retrieve menu item data
						$(checkboxes).each(function(){
							var t = $(this),
								listItemDBIDMatch = re.exec( t.attr('name') ),
								listItemDBID = 'undefined' == typeof listItemDBIDMatch[1] ? 0 : parseInt(listItemDBIDMatch[1], 10);
							if ( this.className && -1 != this.className.indexOf('add-to-top') )
								processMethod = api.addMenuItemToTop;
							menuItems[listItemDBID] = t.closest('li').getItemData( 'add-menu-item', listItemDBID );
						});

						// Add the items
						api.addItemToMenu(menuItems, processMethod, function(){
							// Deselect the items and hide the ajax spinner
							checkboxes.removeAttr('checked');
							t.find('img.waiting').hide();
						});
					});
				},
				getItemData : function( itemType, id ) {
					itemType = itemType || 'menu-item';

					var itemData = {}, i,
					fields = [
						'menu-item-db-id',
						'menu-item-object-id',
						'menu-item-object',
						'menu-item-parent-id',
						'menu-item-position',
						'menu-item-type',
						'menu-item-title',
						'menu-item-url',
						'menu-item-description',
						'menu-item-attr-title',
						'menu-item-target',
						'menu-item-classes',
						'menu-item-xfn'
					];

					if( !id && itemType == 'menu-item' ) {
						id = this.find('.menu-item-data-db-id').val();
					}

					if( !id ) return itemData;

					this.find('input').each(function() {
						var field;
						i = fields.length;
						while ( i-- ) {
							if( itemType == 'menu-item' )
								field = fields[i] + '[' + id + ']';
							else if( itemType == 'add-menu-item' )
								field = 'menu-item[' + id + '][' + fields[i] + ']';

							if (
								this.name &&
								field == this.name
							) {
								itemData[fields[i]] = this.value;
							}
						}
					});

					return itemData;
				},
				setItemData : function( itemData, itemType, id ) { // Can take a type, such as 'menu-item', or an id.
					itemType = itemType || 'menu-item';

					if( !id && itemType == 'menu-item' ) {
						id = $('.menu-item-data-db-id', this).val();
					}

					if( !id ) return this;

					this.find('input').each(function() {
						var t = $(this), field;
						$.each( itemData, function( attr, val ) {
							if( itemType == 'menu-item' )
								field = attr + '[' + id + ']';
							else if( itemType == 'add-menu-item' )
								field = 'menu-item[' + id + '][' + attr + ']';

							if ( field == t.attr('name') ) {
								t.val( val );
							}
						});
					});
					return this;
				}
			});
		},
var myNewRecord = new TopicRecord(
    {
        title: 'Do my job please',
        author: 'noobie',
        totalPosts: 1,
        lastPost: new Date(),
        lastPoster: 'Animal',
        excerpt: 'No way dude!',
        signature: ''
    },
    id // optionally specify the id of the record otherwise {@link #Record.id one is auto-assigned}
);
// update the 2nd record in the store:
var rec = myStore.{@link Ext.data.Store#getAt getAt}(1);

// set the value (shows dirty flag):
rec.set('firstname', 'Betty');

// commit the change (removes dirty flag):
rec.{@link #commit}();

// update the record in the store, bypass setting dirty flag,
// and do not store the change in the {@link Ext.data.Store#getModifiedRecords modified records}
rec.{@link #data}['firstname'] = 'Wilma'; // updates record, but not the view
rec.{@link #commit}(); // updates the view

if(this.proxy){
    // TODO remove deprecated loadexception with ext-3.0.1
    this.relayEvents(this.proxy,  ['loadexception', 'exception']);
}
// With a writer set for the Store, we want to listen to add/remove events to remotely create/destroy records.
if (this.writer) {
    this.on({
        scope: this,
        add: this.createRecords,
        remove: this.destroyRecord,
        update: this.updateRecord,
        clear: this.onClear
    });
}

this.sortToggle = {};
if(this.sortField){
    this.setDefaultSort(this.sortField, this.sortDir);
}else if(this.sortInfo){
    this.setDefaultSort(this.sortInfo.field, this.sortInfo.direction);
}

Ext.data.Store.superclass.constructor.call(this);

if(this.id){
    this.storeId = this.id;
    delete this.id;
}
if(this.storeId){
    Ext.StoreMgr.register(this);
}
if(this.inlineData){
    this.loadData(this.inlineData);
    delete this.inlineData;
}else if(this.autoLoad){
    this.load.defer(10, this, [
        typeof this.autoLoad == 'object' ?
            this.autoLoad : undefined]);
}
// used internally to uniquely identify a batch
this.batchCounter = 0;
this.batches = {};
},

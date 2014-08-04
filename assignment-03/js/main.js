var diary;

(function ( ) {

	diary = {

		init: function(){
			this.accordeon.init();
			this.entries.init();
		},

		editMode: false,

		entries: {

			init: function(){
        /* id of the entry currenty being edited; 0 means not in the edit mode,
        or creating new entry, other numbers - mean entry id that is being edited */
        this.entryId = 0;
				/* maximum id that was used already */
				this.maxId = 0;
        this.load();
				this.interactions.init();
			},

      load: function() {
          var records = [], section;
          // attempt loading  ...
          setTimeout(function() {
              if (records.length === 0) {
                  diary.entries.noEntries();
              } else {
                  // add elements
                  for(var counter=0; counter < records.length; counter++) {
                      diary.entries.displayEntry(records[counter]);
                  }
              }
							section = document.getElementsByTagName("section")[0];
              section.removeChild(document.getElementById("spinner"));
          }, 1000);

      },

      noEntries: function(){
          // create a paragraph
          var noEntriesParagraph = document.createElement('p');
          noEntriesParagraph.innerHTML = "You haven\'t got any entries";
          noEntriesParagraph.setAttribute("id", "no-entries-info");
          document.getElementsByTagName("section")[0].appendChild(noEntriesParagraph);
					document.getElementsByTagName("section")[0].className = "entries no-entries";
      },

      displayEntry: function(record, update) {
          // construct entry
          var entry;
          
          if (update === true) {
            var articles = document.getElementsByTagName('article');
              for(var counter=0; counter < articles.length; counter++)
                {
                    if (articles[counter].getAttribute('article-id') === diary.entries.entryId) {
                        entry = articles[counter];    
                    }
                    
                }
              
          } else {
            
            entry = document.createElement('article');
          }
          
					var newEntryH2 = document.createElement('h2');
					newEntryH2.innerHTML = record.title;

					var actions = document.createElement('span');
					actions.className = 'actions';

					var edit = document.createElement('span');
					edit.className = 'edit-entry';
					var editIcon = document.createElement('i');
					editIcon.className = 'fa fa-pencil';
					var editLabel = document.createElement('span');
					editLabel.innerHTML = 'Edit';
					edit.appendChild(editIcon);
					edit.appendChild(editLabel);
                    edit.addEventListener('click', function(event) {
                        event.preventDefault();
                        diary.entries.edit(this.parentNode.parentNode.parentNode);
                    });

					var trash = document.createElement('span');
					trash.className = 'delete-entry';
					var trashIcon = document.createElement('i');
					trashIcon.className = 'fa fa-trash-o';
					var trashLabel = document.createElement('span');
					trashLabel.innerHTML = 'Delete';
					trash.appendChild(trashIcon);
					trash.appendChild(trashLabel);
                    trash.addEventListener('click', function(event) {
                        event.preventDefault();
                        diary.entries.delete(this.parentNode.parentNode.parentNode);
                    });


					actions.appendChild(edit);
					actions.appendChild(trash);

					var more = document.createElement('span');
					more.className = 'fa fa-ellipsis-h show-actions';
                    more.innerHTML = 'More';
					actions.appendChild(more);
					more.addEventListener('click', function(event){
                        
						diary.entries.interactions.showAction(event, this);
					});

					newEntryH2.appendChild(actions);
					newEntryH2.appendChild(more);

					var newEntryP = document.createElement('p');
					newEntryP.innerHTML = record.content;
          entry.className = "invisible";
					entry.innerHTML = "";
                    entry.setAttribute("article-id", this.maxId);
					entry.appendChild(newEntryH2);
					entry.appendChild(newEntryP);
          if (diary.entries.entryId === 0) {
          document.getElementsByTagName("section")[0].appendChild(entry);
          }
          entry.className = "";
					newEntryH2.addEventListener('click', function(event){
						diary.accordeon.toggle(event);
					});
      },

      addNew: function() {
          var record = {
              title: document.getElementById("title").value,
              content: document.getElementById("content").value
          };
					this.maxId++;
					localStorage.setItem(this.maxId, JSON.stringify(record));
					var noEntriesParagraph = document.getElementById("no-entries-info");
					if (noEntriesParagraph !== null) {
						noEntriesParagraph.parentNode.removeChild(noEntriesParagraph);
					}
					diary.entries.displayEntry(record);
					document.getElementsByTagName("section")[0].className = "entries";
					
      },
            
    update: function() {
        var record = {
              title: document.getElementById("title").value,
              content: document.getElementById("content").value
        };
        localStorage.setItem(this.maxId, JSON.stringify(record));
        diary.entries.displayEntry(record, true);
    },
            
       edit: function(element) {
           diary.entries.entryId = element.getAttribute('article-id');
           if (!diary.editMode) {
        
                diary.entries.form.clear();
                diary.entries.form.show();
                diary.entries.interactions.hideActions();
            }
           
       },
            
            delete: function(element) {
            
            diary.entries.entryId = element.getAttribute('article-id');
            diary.entries.confirmation.show();
            diary.entries.interactions.hideActions();
            
        },

			interactions: {

				init: function() {
					this.add();
					this.discard();
					this.save();
					this.more();
                    this.cancel();
					this.proceed();
				},

				add: function() {
					/* clicking on the add button in the header */
					var _self = diary.entries;
					document.getElementById('add').addEventListener('click', function(event){
						event.preventDefault();
						if (!diary.editMode) {
							_self.form.clear();
							_self.form.show();
							_self.interactions.hideActions();
						}
					});
				},

				discard: function() {
					/* clicking on discard button below edit form */
					var _self = diary.entries;
					document.getElementById('discard').addEventListener('click', function(event){
						event.preventDefault();
						_self.form.hide();
					});
				},

				save: function() {
					/* clicking on save button */
					var _self = diary.entries;
					document.getElementById("save").addEventListener('click', function(event){
							event.preventDefault();
							if (diary.entries.entryId === 0) {
									// validate
                                    if (diary.entries.form.validate()) {
                                        
									   diary.entries.addNew();
                                        
                        diary.entries.form.hide();
                                    }
							} else {
									// validate
                                if (diary.entries.form.validate()) {
                                        
								diary.entries.update();
                                    
                        diary.entries.form.hide();
                                    }
							}
					});
				},

				more: function() {
					/* click on more actions */
						var showActions = document.getElementsByClassName("show-actions");
						for(var counter=0; counter < showActions.length; counter++)
						{
							showActions[counter].addEventListener('click', function(event){
								diary.entries.interactions.showAction(event, this);
							});
						}
					
				},

				showAction: function(event, element) {
					event.stopPropagation();
                    if (!diary.editMode) {
                        
                        var allArticles = document.getElementsByTagName("article");
                        for (var i =0; i < allArticles.length; i++) {
                            if (element.parentNode.parentNode != allArticles[i])
                                diary.accordeon.hide(allArticles[i]);
                        }
                        //setTimeout();                
                        this.hideActions();   
                        element.parentNode.getElementsByClassName("actions")[0].className = "actions active";
                        //element.parentNode.parentNode.class
                    }
                    
				},

				hideActions: function() {
					var articles = document.getElementsByTagName("article");
					for(var counter=0; counter < articles.length; counter++)
					{
						articles[counter].getElementsByClassName("actions")[0].className = "actions";
					}
				},
                
                cancel: function() {
                    var _self = diary.entries;
					document.getElementById('no').addEventListener('click', function(event){
						event.preventDefault();
                        diary.entries.entryId = 0;
						_self.confirmation.hide();
					});
                },
                
                proceed: function() {
                    var _self = diary.entries;
					document.getElementById('yes').addEventListener('click', function(event){
						event.preventDefault();
                        localStorage.removeItem(_self.entryId); 
                        var articles = document.getElementsByTagName("article");
                
                      
                        for(i=0; i<articles.length; i++) {
                           
                                if (articles[i].getAttribute('article-id') === diary.entries.entryId) {
                                    articles[0].parentElement.removeChild(articles[i]);
                                    
                                }
                            
                            
                            
                        }
                        _self.confirmation.hide();
                        diary.entries.entryId = 0;
                        if (articles.length === 0) {
                            diary.entries.noEntries();
                        }
					});
                }

			},
        
        confirmation: {
            
            show: function() {
                diary.editMode = true;
                document.getElementsByTagName("body")[0].className = "delete";
	
            },
            
            hide: function() {
                diary.editMode = false;
                document.getElementsByTagName("body")[0].className = "";
            }
        },

			form: {
                
                validate: function() {
                    var result = false;
                    var title = document.getElementById("title").value;
                    var content = document.getElementById("content").value;
                    
                    if ((title > "") && (content > "")) {
                        result = true;
                    } else {
                        if (title === "") {
                            document.getElementById("title").parentNode.className = "row error";
                        }
                        if (content === "") {
                            document.getElementById("content").parentNode.className = "row error";
                        }
                    }
                    return result;
                },

				show: function() {
                    
					document.getElementsByTagName("body")[0].className = "edit";
					diary.editMode = true;
					for(var counter=0; counter < diary.accordeon.articles.length; counter++)
					{
						diary.accordeon.hide(diary.accordeon.articles[counter]);
					}
                    this.populate();
				},
                
                populate: function() {
                    if (diary.entries.entryId > 0) {
                        //console.log();
                       var record = JSON.parse(localStorage.getItem(diary.entries.maxId));
				        document.getElementById("title").value = record.title;
                        document.getElementById("content").value = record.content;
                    }
                },
                
				hide: function() {
					document.getElementsByTagName("body")[0].className = "";
					diary.editMode = false;
				},

        clear: function() {
            document.getElementById("title").value = "";
            document.getElementById("content").value = "";
            var divs = document.getElementById("entry").getElementsByClassName("row");
            for (var i=0; i<divs.length;i++) {
                divs[i].className = "row";
            }
        }

			}

		},

		accordeon: {

			/* initialise accordeon */
			init: function(){
				this.h2s = document.getElementsByTagName("h2");
				this.articles = document.getElementsByTagName("article");
				this.interactions();
			},

			/* hide article */
			hide: function(article){
				article.className = '';
			},

			/* show article, hide other articles at the same time */
			show: function(article){
				for(var counter=0; counter < this.h2s.length; counter++) {
					this.hide(this.h2s[counter].parentNode);
				}
				article.className = 'active';
			},

			/* decide whether to hide or show - is already open -> then hide */
			toggle: function (event) {
				if (!diary.editMode) {
					diary.entries.interactions.hideActions();
					if ((event.target.parentNode.className).indexOf('active') === -1) {
						this.show(event.target.parentNode);
					} else {
						this.hide(event.target.parentNode);
					}
				}
			},

			/* listen to user interactions: click, touch */
			interactions: function(){
				var _self = this;
				for(var counter=0; counter < this.h2s.length; counter++)
				{
          // todo: add event listener to newly created items
					this.h2s[counter].addEventListener('click', function(event){
						_self.toggle(event);
					});
				}
			}

		}

	};

	diary.init();

})( );
